import React, { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useLazyQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import PaymentInfo from "./PaymentInfo";
import BasicInfo from "./BasicInfo";
import Experience from "./Experience";

import DashboardPicture from "../DashboardPicture";
import DashboardInput from "../DashboardInput";

//GraphQuaiL Query
const GET_USER = gql`
  query {
    me {
      id
      bio
      first_name
      last_name
      email
      city

      industries {
        id
        name
      }
      linkedin_url
      github_url
      portfolio_url
      personal_url
      gender
      twitter_url
      blog_url

      payment_info
    }
  }
`;

//COMponent - <Ryan's accent>
const Dashboard = props => {
  const userID = {
    id: null
  };

  const [getUser, { data: userData }] = useLazyQuery(GET_USER);
  const [editUser, setEditUser] = useState(userData);

  // const [testEditingValue, setTestEditingValue] = useState({
  //   testname: 'Julie A',
  // });
  // const [testOriginalName, setTestOriginalName] = useState('Julie A');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      userID.id = localStorage.getItem("id");
      getUser();
    }
  }, []);

  useEffect(() => {
    setEditUser(userData);
  }, [userData]);

  let myArray = [];
  const basicInfo = [
    "bio",
    "first_name",
    "last_name",
    "email",
    "city",
    "state"
  ];
  const experience = [
    "personal_url",
    "blog_url",
    "linkedin_url",
    "github_url",
    "twitter_url",
    "portfolio_url"
  ];
  const paymentInfo = ["payment_info"];

  return (
    <div className="entire-dashboard">
      


      
      {userData &&
        editUser &&
        Object.keys(userData.me).forEach(field => {
          myArray.push(field);
        })}
        <div className="lower-dashboard">
        <div className="dashboard-left-bar">
      <Link to="/dashboard">Profile</Link>
      <Link to="/dashboard">Schedule</Link>

      </div>
        <div className="dashboard-routes">
        <div className="dashboard-top-links">
      <Link to="/dashboard/basicinfo">Basic Info</Link>
      <Link to="/dashboard/experience">Experience</Link>
      <Link to="/dashboard/paymentinfo">Payment Info</Link>
      </div>
      <Switch>
        <Route
          exact
          path="/dashboard/basicinfo"
          render={props => (
            <BasicInfo
              {...props}
              myArray={myArray}
              basicInfo={basicInfo}
              userData={userData}
            />
          )}
        />
        <Route
          exact
          path="/dashboard/experience"
          render={props => (
            <Experience
              {...props}
              myArray={myArray}
              experience={experience}
              userData={userData}
            />
          )}
        />
        <Route
          exact
          path="/dashboard/paymentinfo"
          render={props => (
            <PaymentInfo
              {...props}
              myArray={myArray}
              paymentInfo={paymentInfo}
              userData={userData}
            />
          )}
        />
      </Switch>
      </div>

      {/* <button className='danger'>Delete MEEEEE</button> */}
      </div>
    </div>
  );
};

export default Dashboard;
