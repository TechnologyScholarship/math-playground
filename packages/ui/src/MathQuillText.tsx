'use client'
import { SizableText, SizableTextProps } from '@t4/ui';
import dynamic from 'next/dynamic'

import React from 'react';
import { createPortal } from 'react-dom';
import { isServer, useDidFinishSSR } from 'tamagui';

const StaticMathField = dynamic(
  () => import('react-mathquill').then((mod) => mod.StaticMathField),
  { ssr: false }
)

function onPropReady<T, P extends string>(object: Record<P, T>, prop: P, callback: (value: T) => void) {
  if (Object.hasOwn(object, prop)) {
    if (object[prop]) callback(object[prop]);
    return;
  }
  Object.defineProperty(object, prop, {
    get() {
      return this.value;
    },
    set(v) {
      if (!this.value) {
        callback(v);
      }
      this.value = v;
    },
  });
}

interface MathQuillInstance {
  getInterface(version: any);
  _MATHQUILL_PATCH_getInterface(version: any);
  registerEmbed(name: string, embed: (id: string) => { htmlString: string, text(): string, latex(): string; });
}

const MATHQUILL_CUSTOM_EMBED = 'customhtmlembed';
const MATHQUILL_CUSTOM_EMBED_IDX = id => `${MATHQUILL_CUSTOM_EMBED}-${id}`;
const MATHQUILL_NULL = 'mqnull';
export const MATHQUILL_NULL_TOKEN = `\\embed{${MATHQUILL_NULL}}[0]`;

export type MathQuillTextProps =
  Omit<SizableTextProps, 'children'> & React.PropsWithChildren<{
    unselectable?: boolean;
  }>;
export const MathQuillText: React.FunctionComponent<MathQuillTextProps> = (props) => {
  const { unselectable, children, ...textProps }: MathQuillTextProps = props;
  const didFinishSSR = useDidFinishSSR();
  const [portalTargets, setPortalTargets] = React.useState<HTMLElement[]>();

  React.useEffect(() => {
    import('react-mathquill').then((mq) => mq.addStyles())
    // Patch CSS to provide an alternate .mq-root-block class with the same styles
    // but which is not accessed by the MathQuill event Controller, for unselectable
    // static math text blocks
    if (!global.MATHQUILL_CSS_PATCHED) {
      global.MATHQUILL_CSS_PATCHED = true;
      for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets.item(i) as CSSStyleSheet;
        for (let j = 0; j < sheet.cssRules.length; j++) {
          const rule = sheet.cssRules.item(j) as CSSRule;
          if (!(rule instanceof CSSStyleRule)) continue;
          // rule.selectorText = rule.selectorText.replace(
          //   /(^|,)([^,{]*?)\.mq-root-block([^,{]*?)([,{])/g,
          //   "$1$2.mq-root-block$3,$2.mq-unselectable-root-block$3$4"
          // );
          rule.selectorText = rule.selectorText.split(',').flatMap(selector => {
            if (!selector.includes('mq-root-block')) return selector;
            return [selector, selector.replaceAll('mq-root-block', 'mq-unselectable-root-block')];
          }).join(',');
        }
      }
    }
    // Patch MathQuill loader to register embed
    onPropReady(global as any, 'MathQuill', (MathQuill: MathQuillInstance) => {
      MathQuill._MATHQUILL_PATCH_getInterface = MathQuill.getInterface;
      Object.defineProperty(MathQuill, 'getInterface', {
        get() {
          return version => {
            const result = this._MATHQUILL_PATCH_getInterface(version);
            result.registerEmbed(MATHQUILL_NULL, () => ({
              htmlString: '<span></span>', // some content is needed for mathquill to parse custom embed
              text: () => '',
              latex: () => '',
            }));
            result.registerEmbed(MATHQUILL_CUSTOM_EMBED, (index) => ({
              htmlString: `<span class="${MATHQUILL_CUSTOM_EMBED_IDX(index)}"></span>`,
              text: () => 'TODO',
              latex: () => 'TODO',
            }));
            return result;
          };
        },
        set(v) {
          this._MATHQUILL_PATCH_getInterface = v;
        },
      });
    });
  }, [])

  let latex = '';
  const embedComps: React.ReactElement[] = [];
  // biome-ignore lint/complexity/noForEach: react children forEach
  React.Children.forEach(children, child => {
    if (child == null || typeof child === 'undefined') {
      // continue
    } else if (React.isValidElement(child)) {
      // Use portal to embed element
      latex += `\\embed{${MATHQUILL_CUSTOM_EMBED}}[${embedComps.length}]`;
      embedComps.push(child);
    } else if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
      // Render as latex
      latex += child;
    } else {
      // const x: never = child;
      throw new TypeError(`Did not expect: ${child}`);
    }
  });

  return (
    <>
      <SizableText unstyled {...textProps}>
        <style dangerouslySetInnerHTML={{
          __html: `
        .mq-root-block, .mq-math-mode {
          overflow: visible !important;
        }
        .mq-cursor {
          ${''/* Prevents cursor causing reflow */}
          position: absolute;
        }
        `}} />
        <StaticMathField
          style={unselectable ? {
            cursor: 'inherit',
          } : undefined}
          mathquillDidMount={math => {
            if (unselectable) {
              // Replace mq-root-block class with style-identical replica
              const root = math.el().querySelector(':scope .mq-root-block');
              root?.classList?.remove('mq-root-block');
              root?.classList?.add('mq-unselectable-root-block');
              // Remove MathQuill's mouse handlers
              if (global.jQuery) global.jQuery(math.el()).off('mousedown');
            }
            const portals: HTMLElement[] = [];
            for (let i = 0; i < embedComps.length; i++) {
              portals.push(math?.el()?.querySelector(`:scope .${MATHQUILL_CUSTOM_EMBED_IDX(i)}`) as HTMLElement);
            }
            setPortalTargets(portals);
          }}
        >
          {latex}
        </StaticMathField>
      </SizableText>
      {...(
        isServer || !didFinishSSR ? embedComps // On first render, render components directly
          : portalTargets ? embedComps.map((comp, i) => createPortal(comp, portalTargets[i]))
            : [])}
    </>
  )
}
