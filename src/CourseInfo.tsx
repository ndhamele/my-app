import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './styles.css';

function CourseInfo(){

return(
    <div className="wrapper">
        <div className="left-sidebar">
            
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Modules</a></li>
                <li><a href="#">Pages</a></li>
                <li><a href="#">Assignments</a></li>
                <li><a href="#">Announcements</a></li>
                
            </ul>
        </div>

        <div className="content">
           
            <div className="row">SYLLABUS_ITCS_ITIS_6112_FALL_2023(Section 091)</div>
            <div className="row">TA Information</div>
            <div className="row">Resource: 6112 Project Grading Rubric</div>
            <div className="row">Resource: 6112-Rubric-Student-Part</div>
            <div className="row">SAMPLE_I Term_ProjectProposal</div>
            <div className="row">Some Term Project IdeasContent Row 2</div>
            <div className="row">Group Form and Sheet</div>
            <div className="row"><a href="#"> Assignment 1</a></div>
           
        </div>

        <div className="right-sidebar">
           
            <ul>
                <li><a href="#">TA Hours</a></li>
                <li><a href="#">Mid term Marks</a></li>
                
            </ul>
        </div>
    </div>

);
}