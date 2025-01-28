import { useEffect, useState } from "react";
import supabase from "src/supabase-client";

export const ShiftForm = () => {
  const [shiftLeader, setShiftLeader] = useState("");

  useEffect(() => {
    fetchShifts();
  });

  const submitShift = async () => {
    const newShift = {
      shift_leader: shiftLeader,
      shift_date: new Date().toISOString(),
      shift_type: 0,
      under_4_min: 80,
      over_8_min: 4,
      miam: 33.3,
      complaints: 1,
      temps: true,
      temps_desc: "temp test",
      cleaning: false,
      cleaning_desc: "cleaning test",
      cash_variance: "Test cash variance",
      notes: "Test notes",
      score: 100,
    };
    const { data, error } = await supabase.from("shifts").insert([newShift]).single();
    if (error) {
      console.log(111, "error", error);
    } else {
      console.log(111, "data", data);
      setShiftLeader("");
    }
    console.log(data, error);
  };

  const fetchShifts = async () => {
    const { data, error } = await supabase.from("shifts").select("*");
    console.log(222, data, error);
  };

  return (
    <>
      <input type="text" placeholder="Shift Leader" onChange={e => setShiftLeader(e.target.value)} value={shiftLeader} />
      {/* <button onClick={async () => {
      const { data, error } = await supabase
        .from('shift_leader')
        .insert([{ name: shiftLeader }]);
      console.log(data, error);
    }}>Add Shift Leader</button> */}
      <button onClick={submitShift}>Submit Shift</button>
    </>
  );
};
