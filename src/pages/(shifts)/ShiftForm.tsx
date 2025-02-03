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
    // TODO: Add Question based on shift type here once Alex writes them
    {
      title: (
        <a
          href="https://app.powerbi.com/MobileRedirect.html?groupObjectId=a6b5220a-f023-41ca-84b6-ec23e5582424&reportPage=ReportSection9a839f0ed7354677c674&ctid=31d4ca9d-2cb3-47ef-869e-c4f106c5a438&Context=share-report&reportObjectId=eaee2ce3-4cf4-4f38-a2af-3bf50cf82a93&bookmarkGuid=15bb9731-6a64-4bca-b900-be7a4800c3cb&action=OpenReport&pbi_source=mobile_ios"
          target="_blank"
          style={{ color: '#000' }}
        >
          Under 4 Min %
        </a>
      ),
      detailKey: 'under_4_min',
      inputType: 'number' as const,
      max: 100,
      min: 0,
      required: true,
    },
    {
      title: (
        <a
          href="https://app.powerbi.com/MobileRedirect.html?reportPage=ReportSectionda560baa0cb0ae1186fe&reportObjectId=eaee2ce3-4cf4-4f38-a2af-3bf50cf82a93&Context=share-report&ctid=31d4ca9d-2cb3-47ef-869e-c4f106c5a438&bookmarkGuid=72f7c55d-6b46-4628-a2a4-2564ce535244&groupObjectId=a6b5220a-f023-41ca-84b6-ec23e5582424&action=OpenReport&pbi_source=mobile_ios"
          target="_blank"
          style={{ color: '#000' }}
        >
          Over 8 Min %
        </a>
      ),
      detailKey: 'over_8_min',
      inputType: 'number' as const,
      max: 100,
      min: 0,
      required: true,
    },
    {
      title: (
        <a
          href="https://app.powerbi.com/MobileRedirect.html?ctid=31d4ca9d-2cb3-47ef-869e-c4f106c5a438&bookmarkGuid=67fe9dd5-bacc-4bc3-98cc-41ef8a6e1894&groupObjectId=a6b5220a-f023-41ca-84b6-ec23e5582424&Context=share-report&reportObjectId=207ea9c8-3102-4059-a5b6-11cbdf7abca4&reportPage=ReportSectionb389f7a9ec3cc5fb91c0&action=OpenReport&pbi_source=mobile_ios"
          target="_blank"
          style={{ color: '#000' }}
        >
          MIAM %
        </a>
      ),
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
