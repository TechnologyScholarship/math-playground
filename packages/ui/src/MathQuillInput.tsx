'use client'
import dynamic from 'next/dynamic'

import { SizableText, SizableTextProps, useTheme } from '@t4/ui'
import React from 'react'
import { EditableMathFieldProps } from 'react-mathquill'

const EditableMathField = dynamic(
  () => import('react-mathquill').then((mod) => mod.EditableMathField),
  { ssr: false }
)

export type MathQuillInputProps = Omit<
  EditableMathFieldProps,
  keyof Omit<React.HTMLProps<HTMLSpanElement>, 'onChange'>
> &
  SizableTextProps

// export class MathQuillInput2 extends React.Component<MathQuillInputProps> {
//   latex: string;
//   constructor (props: MathQuillInputProps) {
//     super(props);
//     this.latex = props.latex;
//   }

//   render() {
//     const {
//       onChange,
//       latex,
//       config,
//       mathquillDidMount,
//       ...textProps
//     } = this.props;
//     const theme = useTheme();
//     React.useEffect(() => {
//       import('react-mathquill').then((mq) => mq.addStyles());
//     }, []);
//     return (
//       <SizableText
//         unstyled={true}
//         {...textProps}
//       >
//         <style dangerouslySetInnerHTML={{
//           __html: `
//         .mq-editable-field.mq-focused {
//           background-color: ${theme.backgroundFocus.get()};
//         }
//         .mq-editable-field .mq-cursor {
//           border-left-color: currentColor !important;
//         }
//       `}} />
//         <EditableMathField
//           config={{
//             spaceBehavesLikeTab: true,
//             restrictMismatchedBrackets: true,
//             supSubsRequireOperand: true,
//             charsThatBreakOutOfSupSub: '+-=<>',
//             autoSubscriptNumerals: true,
//             autoCommands: 'pi theta sqrt sum int',
//             maxDepth: 10,
//             ...config
//           }}
//           latex={latex || textProps.children}
//           onChange={onChange}
//           mathquillDidMount={mathquillDidMount}
//         />
//       </SizableText>
//     );
//   }
// }
export const MathQuillInput: React.FunctionComponent<MathQuillInputProps> = ({
  onChange,
  latex,
  config,
  mathquillDidMount,
  ...textProps
}) => {
  const theme = useTheme()
  React.useEffect(() => {
    import('react-mathquill').then((mq) => mq.addStyles())
  }, [])
  return (
    <SizableText unstyled={true} {...textProps}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .mq-editable-field.mq-focused {
          background-color: ${theme.backgroundFocus.get()};
        }
        .mq-editable-field .mq-cursor {
          border-left-color: currentColor !important;
        }
      `,
        }}
      />
      <EditableMathField
        config={{
          spaceBehavesLikeTab: true,
          restrictMismatchedBrackets: true,
          supSubsRequireOperand: true,
          charsThatBreakOutOfSupSub: '+-=<>',
          autoSubscriptNumerals: true,
          autoCommands: 'pi theta sqrt sum int',
          maxDepth: 10,
          ...config,
        }}
        latex={latex || textProps.children}
        onChange={onChange}
        mathquillDidMount={mathquillDidMount}
      />
    </SizableText>
  )
}
