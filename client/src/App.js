import React, {useState, useEffect} from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode'
import { BrowserRouter as Router, Route, Link, Routes, redirect, useNavigate} from "react-router-dom";
import { useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import './styles.css';

// import components
import {Login} from "./components/Login";
import {Game} from "./components/Game";
import {ReadyUp} from "./components/ReadyUp";

export default function App () {

    const navigate = useNavigate();

    const [userState, setUserState] = useState({
        isLoggedIn : false,
        userId : ""
    });

    const [gameState, setGameState] = useState({
        players: [],
        slots: {
            slotCount: 3,
            slotOptions: [
                {
                    name: 'red',
                    value: 100,
                    img: ''    
                },
                {
                    name: 'blue',
                    value: 50,
                    img: ''    
                },
                {
                    name: 'yellow',
                    value: 0,
                    img: ''    
                },
                {
                    name: 'black',
                    value: -25,
                    img: ''    
                },

            ]
        },
        gameSettings: {
            difficulty: '',
            defaultSpeed: 10
        },
        gameTime: 0,
        State: 'readyUp',
        winner: ''
    })

    // method that invokes react router navigate method, (had to declare navigate on line 16)
    const readyUpRedirect = () => {
        navigate('/readyup');
    }
    
    // function to update our state w/ only permitted updates
    const intializeUserState = (userData) => {
        const userStateObj = {
            isLoggedIn : true,
            userId : userData.email
        }
        setUserState(userStateObj);
    }
    
    // function to update our state w/ only permitted updates
    const initializeGameState = (userData) => {
        const gameStateObj = {
            ...gameState,
            players: [userData.firstName]
        }

        setGameState(gameStateObj);
    }
    
    // on loading App component, run fetch request to see if user has a valid session if they do they get directed to login page. if not they get directed to login page
    useEffect (() => {
        fetch('/isLoggedIn')
        .then(res => res.json())
        .then(res => {
            //if user has an active session in database server respose
            //res object is gonna look like {loggedIn: bool, body:User Document obj from mongodb}
            if(res.isLoggedIn){
                intializeUserState(res.body) // update userState w/ session info
                initializeGameState(res.body) // update playerlist inside GameState
                navigate(res.location);
            } else {
                navigate('/login');
            }
        })
    },[]);

    return (
        <div className="mainContainer">
            <header className="app-header">
                <h1 className="game-title">Yoshi Racers</h1>
                <Button onClick={()=>{readyUpRedirect()}}>button</Button>
            </header>
                <Routes>
                    <Route exact path="/login" element={
                        <Login 
                            // prop drill these components
                            intializeUserState={intializeUserState} 
                            readyUpRedirect={readyUpRedirect}
                            initializeGameState = {initializeGameState}
                            />
                    }/>
                    <Route exact path="/readyup" element={<ReadyUp playerList={gameState.players}/>} />
                    <Route exact path="/game" element={<Game/>} />
                </Routes>
        </div>
    )
}