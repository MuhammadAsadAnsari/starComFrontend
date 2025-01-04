import React from "react";

const DropDown = ({
  labeltext,
  placeholdertext,
  data,
  value,
  setValue,
onChange,
  styling,
}) => {
    const handleChange = (event) => {
      if(setValue){
      setValue(event.target.value);}
    };
  return (
    <div className={`flex flex-col my-1 ${styling}`}>
      <label className="text-sm text-[#282828] font-poppins ss:text-lg mb-2">
        {labeltext && labeltext}
      </label>
      <div className="flex flex-col border-[1px] py-3 pl-3 border-[#DEDEDE] rounded-lg 2xl:py-4 text-[#53615A]">
        <select
          id="select"
          className="font-poppins text-s xl:text-s 2xl:text-xl text-[#53615A] focus:outline-none focus:ring-0 "
          onChange={onChange ? onChange : handleChange} // onChange handler passed from parent
          value={value} // Ensure value is properly controlled
        >
          <option className="text-[#53615A]" value="">
            {placeholdertext}
          </option>
          {data?.map((res) => {
            return (
              <option
                key={res?.client?.id || res?.id || res?._id}
                value={res?.client?.id || res?.id || res?._id} // Serialize the id and name
                className="text-[#53615A]"
              >
                {res?.client?.name || res?.name || res?.value}
              </option>
            );
          })}
          )
        </select>
      </div>
    </div>
  );
};

export default DropDown;
