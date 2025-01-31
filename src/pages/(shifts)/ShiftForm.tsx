import FormBuilder from 'src/components/formBuilder/FormBuilder';
import { Shift } from 'src/types/shift';

interface ShiftFormProps {
  shift: Shift | undefined;
  setShift?: (shift: Shift | undefined) => void;
  editMode?: boolean;
  shiftFormRef?: any;
}

export const ShiftForm = ({ shift, setShift, editMode = false, shiftFormRef }: ShiftFormProps) => {
  const formId = 'shiftForm';

  const formInputs = [
    {
      title: 'Shift Leader',
      detailKey: 'shift_leader',
      inputType: 'text' as const,
      required: true,
    },
    {
      title: 'Date',
      detailKey: 'shift_date',
      inputType: 'date' as const,
      required: true,
    },
    {
      title: 'Shift Type',
      detailKey: 'shift_type',
      inputType: 'dropdown' as const,
      required: true,
      options: [
        { label: 'Open', value: 0 },
        { label: 'Mid', value: 1 },
        { label: 'Close', value: 2 },
      ],
    },
    {
      title: 'Under 4 Min %',
      detailKey: 'under_4_min',
      inputType: 'number' as const,
      max: 100,
      min: 0,
      required: true,
    },
    {
      title: 'Over 8 Min %',
      detailKey: 'over_8_min',
      inputType: 'number' as const,
      max: 100,
      min: 0,
      required: true,
    },
    {
      title: 'MIAM %',
      detailKey: 'miam',
      inputType: 'number' as const,
      max: 100,
      min: 0,
      required: true,
    },
    {
      title: 'Complaints',
      detailKey: 'complaints',
      inputType: 'number' as const,
      min: 0,
      required: true,
    },
    {
      title: 'Temps',
      detailKey: 'temps',
      inputType: 'dropdown' as const,
      required: true,
      inputValue: shift?.temps === true ? 1 : shift?.temps === false ? 0 : undefined,
      onInputChange: (value: number) => {
        if (value === 1) setShift?.({ ...shift, temps: true } as Shift);
        else setShift?.({ ...shift, temps: false } as Shift);
      },
      options: [
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 },
      ],
    },
    {
      title: 'Why was this not completed?',
      detailKey: 'temps_desc',
      inputType: 'textarea' as const,
      hide: shift?.temps != false,
      required: shift?.temps == false,
      orientation: 'column',
    },
    {
      title: 'Cleaning Tasks',
      detailKey: 'cleaning',
      inputType: 'dropdown' as const,
      required: true,
      inputValue: shift?.cleaning === true ? 1 : shift?.cleaning === false ? 0 : undefined,
      onInputChange: (value: number) => {
        if (value === 1) setShift?.({ ...shift, cleaning: true } as Shift);
        else setShift?.({ ...shift, cleaning: false } as Shift);
      },
      options: [
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 },
      ],
    },
    {
      title: 'Why was this not completed?',
      detailKey: 'cleaning_desc',
      inputType: 'textarea' as const,
      hide: shift?.cleaning != false,
      required: shift?.cleaning == false,
      orientation: 'column',
    },
    {
      title: 'Cash Variance',
      detailKey: 'cash_variance',
      inputType: 'textarea' as const,
      orientation: 'column',
    },
    {
      title: 'Any notes?',
      detailKey: 'notes',
      inputType: 'textarea' as const,
      orientation: 'column',
    },
  ];

  return (
    <FormBuilder
      ref={shiftFormRef}
      item={shift}
      updateItem={setShift}
      inputs={formInputs}
      editMode={editMode}
      formId={formId}
    />
  );
};
