import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function Quiz(){

const navigate = useNavigate();

const [height,setHeight] = useState("");
const [weight,setWeight] = useState("");
const [size,setSize] = useState("");

const submitQuiz = () => {

const data = {height,weight,size};

localStorage.setItem("glamziBody",JSON.stringify(data));

navigate("/home");

};

return(

<div className="container">

<h1 className="logo">GLAMZI</h1>
<p className="tagline">Your Fashion Profile</p>

<div className="card">

<h2>Body Quiz</h2>

<input
placeholder="Height (cm)"
value={height}
onChange={(e)=>setHeight(e.target.value)}
/>

<input
placeholder="Weight (kg)"
value={weight}
onChange={(e)=>setWeight(e.target.value)}
/>

<select onChange={(e)=>setSize(e.target.value)}>

<option>Select Size</option>
<option>XS</option>
<option>S</option>
<option>M</option>
<option>L</option>
<option>XL</option>

</select>

<button className="generate" onClick={submitQuiz}>
Start Styling
</button>

</div>

</div>

);

}