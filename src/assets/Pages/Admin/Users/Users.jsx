import React from 'react'
import GetAllUsers from '../../../../Components/Users/GetAllUsers'
import AdminSideNav from '../../../../Components/SideNav/AdminSideNav';

const Users = () =>
   {
    console.log("in users");
  return (
    <div className='flex flex-col md:flex-row w-full h-screen bg-cover bg-center bg-no-repeat bg-[url("https://i.ibb.co/S69yyvw/thumbnail.jpg")]'>

        <AdminSideNav/>

      <div className="h-full md:flex-row basis-[95%]">
        <GetAllUsers />
      </div>
    </div>
  );
}

export default Users
