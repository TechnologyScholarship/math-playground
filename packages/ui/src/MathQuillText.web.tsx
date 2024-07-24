import { isServer, useDidFinishSSR } from '@t4/ui'

import React from 'react';
import { createPortal } from 'react-dom';
import { MathQuillTextProps } from './MathQuillText';
import { RawMathQuillText } from './RawMathQuillText';
import { MathField } from 'react-mathquill'

function onPropReady<T, P extends string>(
  object: Record<P, T>,
  prop: P,
  callback: (value: T) => void
) {
  if (Object.hasOwn(object, prop)) {
    if (object[prop]) callback(object[prop])
    return
  }
  Object.defineProperty(object, prop, {
    get() {
      return this.value
    },
    set(v) {
      if (!this.value) {
        callback(v)
      }
      this.value = v
    },
  });
}

interface MathQuillInstance {
  getInterface(version: any);
  _MATHQUILL_PATCH_getInterface(version: any): void
  registerEmbed(
    name: string,
    embed: (id: string) => { htmlString: string; text(): string; latex(): string; }
  ): void;
}

const MATHQUILL_CUSTOM_EMBED = 'customhtmlembed';
const MATHQUILL_CUSTOM_EMBED_IDX = (id) => `${MATHQUILL_CUSTOM_EMBED}-${id}`;
const MATHQUILL_NULL = 'mqnull';
export const MATHQUILL_NULL_TOKEN = `\\embed{${MATHQUILL_NULL}}[0]`

export const MathQuillText: React.FunctionComponent<MathQuillTextProps> = (props) => {
  const { children, ...textProps }: MathQuillTextProps = props;
  const didFinishSSR = useDidFinishSSR();
  const [portalTargets, setPortalTargets] = React.useState<HTMLElement[]>();
  const [latex, setLatex] = React.useState<string>();
  const [mathField, setMathField] = React.useState<MathField>();
  const [baseId, setBaseId] = React.useState(0);
  const childComponents = React.useRef<React.ReactElement[]>(
    React.Children.toArray(children).filter(React.isValidElement)
  )

  React.useEffect(() => {
    // Patch CSS to provide an alternate .mq-root-block class with the same styles
    // but which is not accessed by the MathQuill event Controller, for unselectable
    // static math text blocks
    if (!(global as any)._MATHQUILL_CSS_PATCHED) {
      ; (global as any)._MATHQUILL_CSS_PATCHED = true
      for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets.item(i) as CSSStyleSheet
        for (let j = 0; j < sheet.cssRules.length; j++) {
          const rule = sheet.cssRules.item(j) as CSSRule
          if (!(rule instanceof CSSStyleRule)) continue
          // rule.selectorText = rule.selectorText.replace(
          //   /(^|,)([^,{]*?)\.mq-root-block([^,{]*?)([,{])/g,
          //   "$1$2.mq-root-block$3,$2.mq-unselectable-root-block$3$4"
          // );
          rule.selectorText = rule.selectorText
            .split(',')
            .flatMap((selector) => {
              if (!selector.includes('mq-root-block')) return selector;
              return [selector, selector.replaceAll('mq-root-block', 'mq-unselectable-root-block')]
            })
            .join(',')
        }
      }
    }
    // Patch MathQuill loader to register embed
    onPropReady(global as any, 'MathQuill', (MathQuill: MathQuillInstance) => {
      MathQuill._MATHQUILL_PATCH_getInterface = MathQuill.getInterface
      Object.defineProperty(MathQuill, 'getInterface', {
        get() {
          return (version) => {
            const result = this._MATHQUILL_PATCH_getInterface(version)
            result.registerEmbed(MATHQUILL_NULL, () => ({
              htmlString: '<span></span>', // some content is needed for mathquill to parse custom embed
              text: () => '',
              latex: () => '',
            }))
            result.registerEmbed(MATHQUILL_CUSTOM_EMBED, (index) => ({
              htmlString: `<span style="display: inline-block;" class="${MATHQUILL_CUSTOM_EMBED_IDX(
                index
              )}"></span>`,
              text: () => 'test', //(global as any)._MATHQUILL_EMBED_CALLBACKS?.[index]?.text?.() ?? '[?]',
              latex: () => 'test', //(global as any)._MATHQUILL_EMBED_CALLBACKS?.[index]?.latex?.() ?? '[?]',
            }));
            return result
          }
        },
        set(v) {
          this._MATHQUILL_PATCH_getInterface = v
        },
      });
    })
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    ; (global as any)._MATHQUILL_EMBEDS_GLOBAL_ID_COUNTER =
      (global as any)._MATHQUILL_EMBEDS_GLOBAL_ID_COUNTER ?? 0;
    let latex = '';
    const embedComps: React.ReactElement[] = [];
    let elementCount = 0
    // biome-ignore lint/complexity/noForEach: react children
    React.Children.forEach(children, (el) => {
      if (React.isValidElement(el)) elementCount++;
    })
    // biome-ignore lint/suspicious/noAssignInExpressions: atomic
    const baseId = ((global as any)._MATHQUILL_EMBEDS_GLOBAL_ID_COUNTER += elementCount)
      - elementCount
    // biome-ignore lint/complexity/noForEach: react children forEach
    React.Children.forEach(children, (child) => {
      if (child == null || typeof child === 'undefined') {
        // continue
      } else if (React.isValidElement(child)) {
        // Use portal to embed element
        latex += `\\embed{${MATHQUILL_CUSTOM_EMBED}}[${embedComps.length + baseId}]`;
        embedComps.push(child)
      } else if (
        typeof child === 'string' ||
        typeof child === 'number' ||
        typeof child === 'boolean'
      ) {
        // Render as latex
        latex += child
      } else {
        // const x: never = child;
        throw new TypeError(`Did not expect: ${child}`)
      }
    });
    setBaseId(baseId);
    setLatex(latex);
    childComponents.current = embedComps;
  }, [children])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    const portals: HTMLElement[] = []
    // Observe for portal mount
    if (!mathField) return;
    const observer = new MutationObserver(() => mathField.reflow())
    for (let i = 0; i < childComponents.current.length; i++) {
      const portalHost = mathField
        .el()
        .querySelector(`:scope .${MATHQUILL_CUSTOM_EMBED_IDX(i + baseId)}`) as HTMLElement;
      if (!portalHost) {
        return; // Fail gracefully
      }
      ; (global as any)._MATHQUILL_EMBED_CALLBACKS = (global as any)._MATHQUILL_EMBED_CALLBACKS ?? {}
        ; (global as any)._MATHQUILL_EMBED_CALLBACKS[i + baseId] = {
        text: childComponents.current[i].props.toString,
          latex: childComponents.current[i].props.toLatex,
        }
      portals.push(portalHost);
      observer.observe(portalHost, { attributes: false, childList: true, subtree: false });
    }
    setPortalTargets(portals);
  }, [mathField, childComponents /* TODO: may need updated after delay? */, baseId]);
  React.useLayoutEffect(() => { mathField?.reflow?.(); }, [mathField])

  return (
    <RawMathQuillText
      {...textProps}
      mathquillDidMount={setMathField}
      _additionalRawChildren={
        isServer || !didFinishSSR || !portalTargets
          ? childComponents.current // On first render, render components directly
          : childComponents.current.map((comp, i) => createPortal(comp, portalTargets[i]))
      }
    >
      {latex ?? ''}
    </RawMathQuillText>
  );
};
