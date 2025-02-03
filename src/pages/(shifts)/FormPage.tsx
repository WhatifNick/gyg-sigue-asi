import { useState, useEffect, useRef } from 'react';
import supabase from 'src/supabase-client';
import { Button } from '@mui/material';
import { ShiftForm } from './ShiftForm';
import { Shift } from 'src/types/shift';
import chihuahua from 'src/assets/chihuahua.gif';
import avocado from 'src/assets/avocado.gif';
import cheetah from 'src/assets/cheetah.gif';
import dragon from 'src/assets/dragon.gif';

export const FormPage = () => {
  const shiftFormRef = useRef<{ isValid: () => Promise<boolean> } | null>(null);
  const [shift, setShift] = useState<Shift | undefined>(undefined);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    setShift({
      shift_date: new Date().toISOString(),
    } as Shift);
  }, []);

  useEffect(() => {
    updateScore();
  }, [shift]);

  const submitShift = async () => {
    const isFormValid = await shiftFormRef?.current?.isValid();

    const newShift = { ...shift, score };
    if (isFormValid) {
      const { data, error } = await supabase.from('shifts').insert([newShift]).single();
      if (error) {
        console.error('error', error);
      } else {
        setShift?.(undefined);
      }
    }
  };

  const updateScore = () => {
    if (!shift) return;

    const under4Min = shift?.under_4_min ?? 0;

    const over8Min = shift?.over_8_min;
    let over8MinScore = 0;
    if (typeof over8Min === 'number') {
      if (over8Min >= 4) {
        over8MinScore = 50;
      } else if (over8Min >= 3) {
        over8MinScore = 70;
      } else if (over8Min >= 2) {
        over8MinScore = 80;
      } else if (over8Min >= 1) {
        over8MinScore = 90;
      } else {
        over8MinScore = 100;
      }
    }

    const miam = shift?.miam ?? 0;
    let miamScore = 0;
    if (miam) {
      if (miam >= 31) {
        miamScore = 100;
      } else if (miam >= 29) {
        miamScore = 95;
      } else if (miam >= 27) {
        miamScore = 80;
      } else if (miam >= 25) {
        miamScore = 70;
      } else {
        miamScore = 40;
      }
    }

    const complaints = shift?.complaints;
    let complaintsScore = 0;
    if (typeof complaints === 'number') {
      complaintsScore = complaints * 5;
    }

    const temps = shift?.temps;
    const tempsScore = temps === false ? 10 : 0;
    const cleaning = shift?.cleaning;
    const cleaningScore = cleaning === false ? 10 : 0;
    const sum = under4Min + over8MinScore + miamScore;
    const total = (under4Min ? 1 : 0) + (typeof over8Min === 'number' ? 1 : 0) + (miam ? 1 : 0);
    const average = sum / total - complaintsScore - tempsScore - cleaningScore;

    setScore(average || 0);
  };

  const getGraphic = () => {
    const randomNumber = Math.floor(Math.random() * 4) + 1;

    switch (randomNumber) {
      case 1:
        return <img src={chihuahua} alt="dancing chihuahua" style={{ height: '200px' }} />;
      case 2:
        return <img src={avocado} alt="avo nice day avocado" style={{ height: '200px' }} />;
      case 3:
        return <img src={cheetah} alt="roaring cheetah" style={{ height: '200px' }} />;
      case 4:
        return <img src={dragon} alt="dancing dragon" style={{ height: '200px' }} />;
      default:
        return <img src={chihuahua} alt="dancing chihuahua" style={{ height: '200px' }} />;
    }
  };

  return (
    <>
      <div style={{ maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        <div style={{ textAlign: 'center' }}>{getGraphic()}</div>
        <ShiftForm shift={shift} setShift={setShift} editMode shiftFormRef={shiftFormRef} />
      </div>
      {/* Footer */}
      <div
        id="footer"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffd204',
          height: '3rem',
          zIndex: 1001,
          padding: '0 0.5rem',
          boxSizing: 'border-box',
        }}
      >
        <h2>Score: {Math.round(score)}</h2>
        <Button
          variant="outlined"
          onClick={submitShift}
          sx={{ background: '#fff', color: '#000', borderColor: '#000' }}
        >
          Submit
        </Button>
      </div>
    </>
  );
};
