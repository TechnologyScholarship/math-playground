'use client'
import { SizableText, SizableTextProps, TamaguiElement, useThemeName, View } from '@t4/ui';
import dynamic from 'next/dynamic'

import React, { ReactElement, useRef } from 'react'
import { createRoot } from 'react-dom/client';
import { config } from '@t4/ui/src/tamagui.config';
import { MathField } from 'react-mathquill';

const StaticMathField = dynamic(
  () => import('react-mathquill').then((mod) => mod.StaticMathField),
  { ssr: false }
)

type MathQuillInputField = Omit<ReactElement, ''>

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

const MATHQUILL_NULL = 'mqnull';
export const MATHQUILL_NULL_TOKEN = `\\embed{${MATHQUILL_NULL}}[0]`;
const MATHQUILL_CUSTOM_EMBED = 'customhtmlembed';
const MATHQUILL_CUSTOM_EMBED_IDX = id => `${MATHQUILL_CUSTOM_EMBED}-${id}`;
export const MathQuillText: React.FunctionComponent<
SizableTextProps & { children: string | (string | MathQuillInputField)[]; unselectable?: boolean; }
> = (props) => {
  const theme = useThemeName();
  const { unselectable, children, ...textProps } = props;
  const [embedContainer, setEmbedContainer] = React.useState<TamaguiElement | null>();
  const [mathField, setMathField] = React.useState<MathField>();
  React.useEffect(() => {
    import('react-mathquill').then((mq) => mq.addStyles())
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
  const embedded: MathQuillInputField[] = [];
  const c: (MathQuillInputField | string)[] = typeof children === 'string' ? [children] : children;
  for (const e of c) {
    if (typeof e === 'string') {
      latex += e;
    } else {
      latex += `\\embed{${MATHQUILL_CUSTOM_EMBED}}[${embedded.length}]`;
      embedded.push(e);
    }
  }
  React.useEffect(() => {
    for (let i = 0; i < embedded.length; i++) {
      if (!(embedContainer as HTMLElement)?.children.length) break;
      mathField?.el()?.querySelector(`:scope .${MATHQUILL_CUSTOM_EMBED_IDX(i)}`)
        ?.appendChild((embedContainer as HTMLElement)?.children[0]);
    }
    mathField?.reflow();
  }, [mathField, embedContainer])
  return (
    <>
      <SizableText whiteSpace='nowrap' unstyled {...textProps}>
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
          onMouseDownCapture={unselectable ? (e) => e.stopPropagation() : undefined}
          mathquillDidMount={setMathField}
        >
          {latex}
        </StaticMathField>
      </SizableText>
      <View display='none' ref={setEmbedContainer}>
        {...embedded}
        {/* {...embedded.map((comp, i) => React.cloneElement(comp, {
          key: i,
          ref: el => {
            mathField?.el()?.querySelector(`:scope .${MATHQUILL_CUSTOM_EMBED_IDX(i)}`)
              ?.appendChild(el);
          }
        }))} */}
      </View>
    </>
  )
}
