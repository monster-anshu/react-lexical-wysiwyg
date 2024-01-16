import React, { FC, useCallback } from 'react';
import Select from '@/ui/Select';
import {
  $INTERNAL_isPointSelection,
  $getSelection,
  LexicalEditor,
} from 'lexical';
import { $patchStyleText } from '@lexical/selection';
import { FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS } from '@/common';

interface IFontDropDownProps {
  editor: LexicalEditor;
  value: string;
  style: 'font-family' | 'font-size';
  disabled?: boolean;
}

const FontDropDown: FC<IFontDropDownProps> = ({
  editor,
  value,
  style,
  disabled = false,
}) => {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($INTERNAL_isPointSelection(selection)) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style]
  );

  const buttonAriaLabel =
    style === 'font-family'
      ? 'Formatting options for font family'
      : 'Formatting options for font size';

  const options = (
    style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS
  ).map(([option, text]) => {
    return {
      label: text,
      value: option,
      handler: () => handleClick(option),
    };
  });

  return (
    <Select
      options={options}
      value={value}
      onChange={(option) => option.handler()}
      placeholder={style === 'font-family' ? 'Font Family' : 'Font Size'}
      disabled={disabled}
    />
  );
};

export default FontDropDown;
