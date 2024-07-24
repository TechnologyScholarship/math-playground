import {
  Adapt,
  FontSizeTokens,
  getFontSize,
  Select,
  SelectProps,
  SelectValueExtraProps,
  Sheet,
  YStack,
} from '@t4/ui';
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { LinearGradient } from 'tamagui/linear-gradient';
import React from 'react';
import { ActionTermsContext } from '@t4/ui/src/EquationAction';

export type SelectMathProps = React.PropsWithChildren<SelectProps> & {
  name: string;
  key?: string | number;
  placeholder?: SelectValueExtraProps['placeholder'];
};

export function SelectMath({ name, placeholder = undefined, key = undefined, ...props }: SelectMathProps) {
  const ctx = React.useContext(ActionTermsContext);
  const [value, setValue] = React.useState(props.defaultValue);
  React.useEffect(() => {
    if (ctx) ctx[key ?? name.toLowerCase()] = value ?? '';
  }, [ctx, value, key, name]);
  return (
    <Select size='$2' value={value} onValueChange={setValue} {...props}>
      <Select.Trigger icon={ChevronDown}>
        <Select.Value placeholder={value ?? placeholder ?? props.defaultValue} />
      </Select.Trigger>

      <Adapt when='sm' platform='touch'>
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay animation='lazy' enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems='center'
          justifyContent='center'
          position='relative'
          width='100%'
          height='$3'
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
            borderRadius='$4'
          />
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          animation='quick'
          animateOnly={['transform', 'opacity']}
          enterStyle={{ o: 0, y: -10 }}
          exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <Select.Group>
            <Select.Label>{name}</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {React.useMemo(
              () =>
                React.Children.map(props.children, (child, i: number) => {
                  const item = child as { props: { key: React.Key; } | { children: string; }; };
                  return (
                    <Select.Item
                      index={i}
                      key={'key' in item.props ? item.props.key : item.props.children}
                      value={'key' in item.props ? `${item.props.key}` : item.props.children}
                      flexDirection='row-reverse'
                      alignItems='flex-end'
                    >
                      <Select.ItemText>{item}</Select.ItemText>
                      <Select.ItemIndicator marginRight='auto'>
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [props.children]
            )}
          </Select.Group>
          {/* Native gets an extra icon */}
          {props.native && (
            <YStack
              position='absolute'
              right={0}
              top={0}
              bottom={0}
              alignItems='center'
              justifyContent='center'
              width={'$4'}
              pointerEvents='none'
            >
              <ChevronDown size={getFontSize((props.size as FontSizeTokens) ?? '$true')} />
            </YStack>
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems='center'
          justifyContent='center'
          position='relative'
          width='100%'
          height='$3'
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
            borderRadius='$4'
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}
