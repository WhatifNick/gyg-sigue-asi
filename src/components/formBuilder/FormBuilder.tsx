import React, {
  ComponentProps,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from 'react';
import * as yup from 'yup';
import { Typography, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  TextDetailRow,
  TextareaDetailRow,
  DropdownDetailRow,
  DateDetailRow,
  PeoplePickerDetailRow,
  OptionsProps,
  TimePickerDetailRow,
  SwitchRow,
  NumberDetailRow,
  DropdownMultipleDetailRow,
  AutocompleteDetailRow,
} from './FormInputs';
import { get } from 'lodash';
import FormRow from './FormRow';
import { useUsers } from 'src/hooks/users/useUsers';
import { User } from 'src/types/user';

interface IFormBuilder {
  item: any;
  updateItem?: (item: any) => void;
  inputs: IInput[];
  editMode?: boolean;
  formId?: string;
}

export interface IInput {
  title?: string; // Display name for the input label
  detailKey?: string; // Only use if different from fieldName. Used to update the key on the item or gets returned by onInputChange
  inputType:
    | 'text'
    | 'number'
    | 'currency'
    | 'wholeNumber'
    | 'textarea'
    | 'autoComplete'
    | 'dropdown'
    | 'dropdownMultiple'
    | 'date'
    | 'peoplePicker'
    | 'time'
    | 'totalTime' // Returns total time as number in hours.minutes format ex: 8.5, can only return max of 24 hours
    | 'switch'
    | 'customInput'
    | 'customRow';
  onInputChange?: (value: any, detailKey: string) => void; // If onInputChange is provided, use that function, otherwise use updateItem
  inputValue?: any; // Use inputValue if provided, otherwise get value from item using detailKey
  options?: OptionsProps[]; // For dropdowns with lookup values in shape of [{ value: number | string, label: string }]
  choices?: string[]; // For dropdowns in shape of ['choice1', 'choice2']
  required?: boolean; // Puts asterisk next to label and adds validation
  displayOnly?: boolean; // Will not toggle when editMode is changed
  hide?: boolean; // Will not render the input
  customInput?: React.ReactNode; // Custom display/input
  customRow?: React.ReactNode; // Custom display/input
  min?: number; // User for number field
  max?: number; // User for number field
  isError?: boolean; // Used to determine if the row is valid
  customErrorText?: string; // Custom error message to display when isError is true
  usersCustom?: User[]; // Custom users list for peoplePicker
  dateOptions?: Omit<
    ComponentProps<typeof DatePicker>,
    'value' | 'format' | 'onChange' | 'sx' | 'slotProps'
  >; // Options for date input
}

const FormBuilder = forwardRef((props: IFormBuilder, ref) => {
  const { item, inputs, editMode = false, updateItem, formId } = props;

  const [formSchema, setFormSchema] = useState<yup.ObjectSchema<{}, yup.AnyObject, {}, ''> | null>(
    null
  );
  const [formValues, setFormValues] = useState({});
  const [inputErrors, setInputErrors] = useState({});
  const [isFirstSubmit, setIsFirstSubmit] = useState(true);

  const { data: users } = useUsers();
  const usersOptions = useMemo(() => {
    return users?.sort((a, b) => a.Title.localeCompare(b.Title));
  }, [users]);

  useEffect(() => {
    buildFormSchema();
  }, [inputs, item]);

  const handleUpdateItem = (value: string | number | null, detailKey: string) => {
    updateItem && updateItem({ ...item, [detailKey]: value });
  };

  useImperativeHandle(ref, () => {
    return {
      async isValid() {
        const isValid = await onSubmit();
        if (isValid) {
          setIsFirstSubmit(true);
        }
        return isValid;
      },
      errors: inputErrors,
      isError: Object.values(inputErrors).some((error) => error === true),
    };
  });

  const buildFormSchema = () => {
    // Get fields that are not display only and have validation
    const fieldsWithValidation = inputs.filter(
      (input: IInput) =>
        !input.hide && !input.displayOnly && (input?.required || input?.min || input?.max)
    );

    let newFormValues = {};
    let newFormErrors = {};

    const schemaObject = fieldsWithValidation.reduce((acc, input) => {
      if (!input?.detailKey) return acc;
      const inputValue = input?.inputValue ?? item?.[input.detailKey];
      newFormValues = { ...newFormValues, [input.detailKey]: inputValue };
      let isInputError = false;
      let nextAcc = acc;

      switch (input.inputType) {
        case 'text':
          isInputError = inputValue ? false : true;
          nextAcc = { ...acc, [input.detailKey]: yup.string().required() };
          break;
        case 'number':
        case 'currency':
        case 'wholeNumber':
        case 'totalTime':
          // If input is not required and there is no value, skip validation
          if (!input.required && !inputValue) {
            isInputError = false;
            nextAcc = acc;
            break;
          }
          if (input.min && input.max) {
            nextAcc = {
              ...acc,
              [input.detailKey]: yup.number().required().min(input.min).max(input.max),
            };
          } else if (input.min) {
            nextAcc = { ...acc, [input.detailKey]: yup.number().required().min(input.min) };
          } else if (input.max) {
            nextAcc = { ...acc, [input.detailKey]: yup.number().required().max(input.max) };
          } else {
            nextAcc = { ...acc, [input.detailKey]: yup.number().required() };
          }
          isInputError = inputValue ? false : true;
          break;
        case 'textarea':
          if (!input.required && !inputValue) {
            isInputError = false;
            nextAcc = acc;
            break;
          }
          if (input.max) {
            nextAcc = { ...acc, [input.detailKey]: yup.string().required().max(input.max) };
          } else {
            nextAcc = { ...acc, [input.detailKey]: yup.string().required() };
          }
          isInputError = inputValue ? false : true;
          break;
        case 'autoComplete':
          isInputError = inputValue ? false : true;
          nextAcc = { ...acc, [input.detailKey]: yup.string().required() };
          break;
        case 'dropdown':
          // For Choice fields
          if (input?.choices?.length) {
            nextAcc = { ...acc, [input.detailKey]: yup.string().required() };
          } else if (input?.options?.length) {
            // For Lookup fields
            if (typeof input?.options[0].value === 'number') {
              isInputError = inputValue ? false : true;
              nextAcc = {
                ...acc,
                [input.detailKey]: yup.number().required(),
              };
            } else if (typeof input?.options[0].value === 'string') {
              isInputError = inputValue ? false : true;
              nextAcc = {
                ...acc,
                [input.detailKey]: yup.string().required(),
              };
            }
          }
          break;
        case 'dropdownMultiple':
          isInputError = inputValue?.length ? false : true;
          nextAcc = { ...acc, [input.detailKey]: yup.array().min(1).required() };
          break;
        case 'date':
        case 'time':
          isInputError = inputValue ? false : true;

          let datetimeSchema = yup.date();
          if (input?.dateOptions?.minDate) {
            datetimeSchema = datetimeSchema.min(input.dateOptions.minDate);
          }
          if (input?.dateOptions?.maxDate) {
            datetimeSchema = datetimeSchema.max(input.dateOptions.maxDate);
          }
          nextAcc = { ...acc, [input.detailKey]: datetimeSchema.required() };
          break;
        case 'switch':
          isInputError = inputValue ? false : true;
          nextAcc = {
            ...acc,
            [input.detailKey]: yup.boolean().oneOf([true], 'Field must be checked'),
          };
          break;
        case 'peoplePicker':
          isInputError = inputValue ? false : true;
          if (typeof inputValue === 'number') {
            nextAcc = {
              ...acc,
              [input.detailKey]: yup.number().required(),
            };
          } else {
            nextAcc = {
              ...acc,
              [input.detailKey]: yup.string().required(),
            };
          }
          break;
        default:
          nextAcc = acc;
          break;
      }

      newFormErrors = {
        ...newFormErrors,
        [input.detailKey]: isInputError,
      };

      return nextAcc;
    }, {});

    setFormValues(newFormValues);

    // Set errors after first submit
    if (!isFirstSubmit) setInputErrors(newFormErrors);

    const schema = yup.object(schemaObject);

    setFormSchema(schema);
  };

  const onSubmit = async () => {
    if (!formSchema) return;

    const isValid = await formSchema?.isValid(formValues);
    if (isFirstSubmit) setIsFirstSubmit(false);

    // If form is not valid, check which inputs are incorrect:
    await formSchema
      .validate(formValues, { abortEarly: false })
      .then(() => setInputErrors({}))
      .catch((err: any) => {
        // Collect all errors in { detailKey: boolean } format
        const errors = err?.inner?.reduce((acc: any, error: any) => {
          return {
            ...acc,
            [error.path]: true,
          };
        }, {});

        setInputErrors(errors);
      });

    // Don't allow submission if any inputs have custom errors using isError
    if (inputs.some((input) => !input.hide && input.isError)) return false;

    return isValid;
  };

  return (
    <form id={formId}>
      <Stack spacing={1}>
        {inputs.map((input: IInput, index) => {
          if (input.hide) return null;
          const inputKey = `${input?.detailKey ?? 'custom'}-input-${index}`;
          const itemValue = input?.detailKey ? item?.[input?.detailKey] : null;
          const { onInputChange, inputValue, ...rest } = input;
          const inputProps = {
            value: inputValue ?? itemValue,
            editMode: input.displayOnly ? false : editMode,
            // key: inputKey,
            onInputChange: (value: any, detailKey: string) => {
              input?.detailKey && setFormValues({ ...formValues, [input.detailKey]: value });
              // If onInputChange is provided, use that function, otherwise use handleUpdateItem
              onInputChange ? onInputChange(value, detailKey) : handleUpdateItem(value, detailKey);
            },
            error:
              !isFirstSubmit && !!input?.detailKey && get(inputErrors, input?.detailKey, false),
            ...rest,
          };
          switch (input.inputType) {
            case 'text':
              return <TextDetailRow key={inputKey} {...inputProps} />;
            case 'number':
            case 'currency':
            case 'wholeNumber':
              return <NumberDetailRow key={inputKey} type={input.inputType} {...inputProps} />;
            case 'textarea':
              return <TextareaDetailRow key={inputKey} {...inputProps} />;
            case 'autoComplete':
              return <AutocompleteDetailRow key={inputKey} {...inputProps} />;
            case 'dropdown':
              return <DropdownDetailRow key={inputKey} {...inputProps} />;
            case 'dropdownMultiple':
              return <DropdownMultipleDetailRow key={inputKey} {...inputProps} />;
            case 'date':
              return <DateDetailRow key={inputKey} {...inputProps} />;
            case 'peoplePicker':
              return (
                <PeoplePickerDetailRow
                  key={inputKey}
                  users={inputProps.usersCustom ?? usersOptions}
                  {...inputProps}
                />
              );
            case 'time':
            case 'totalTime':
              return <TimePickerDetailRow key={inputKey} type={input.inputType} {...inputProps} />;
            case 'switch':
              return <SwitchRow key={inputKey} {...inputProps} />;
            case 'customInput':
              return (
                <FormRow key={inputKey} {...inputProps}>
                  {input.customInput}
                </FormRow>
              );
            case 'customRow':
              return (
                <span key={inputKey}>
                  {input?.customRow}
                  {inputProps?.isError && inputProps?.customErrorText && (
                    <Typography
                      variant="caption"
                      color="error"
                      textAlign="right"
                      sx={{ mt: '0 !important' }}
                    >
                      *{inputProps?.customErrorText}
                    </Typography>
                  )}
                </span>
              );
            default:
              return null;
          }
        })}
        <Typography
          variant="caption"
          color="error"
          textAlign="end"
          display={
            !isFirstSubmit && Object.values(inputErrors).some((error) => error === true) === true
              ? 'block'
              : 'none'
          }
        >
          *Above fields are required
        </Typography>
      </Stack>
    </form>
  );
});

export default FormBuilder;
