import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './styles.css';

function Assignment1(){

    return(
        <div className="assignment-container">
        <h1>Assignment Details</h1>
        <label>Assignment Name: Write a review on research paper</label> <br></br>
        <label>Marks: 20</label> <br></br>


        <label>Due Date:</label>
        <input type="datetime-local" id="dueDate" />

    </div>
    );
}