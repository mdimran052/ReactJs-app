import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table'
import './App.css';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

function App() {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('ws://city-ws.herokuapp.com');
  const {
    lastMessage
  } = useWebSocket(socketUrl);
  
  useEffect(()=>{
    document.title="Proximity AQI Test";});

  let inlinestylesGood : any = {color:'#00e600'};
  let inlinestylesSat  : any = {color:'#009900'};
  let inlinestylesSev  : any = {color:'#990000'};
  let inlinestylesVP   : any = {color:'#e60000'};
  let inlinestylesPoor : any = {color:'#ff8c00'};
  let inlinestylesMod  : any = {color:'#ffff66'};
  
  let standards :any =[{'range':'0-51','desc':'Good'},
  {'range':'51-100','desc':'Satisfactory'},
  {'range':'101-200','desc':'Moderate'},
  {'range':'201-300','desc':'Poor'},
  {'range':'301-400','desc':'Very Poor'},
  {'range':'401-500','desc':'Severe'}] 
  
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>Air Quality Index Dashboard</h2>
          <Table bordered hover variant="dark" className="App-Table-Size">
            <thead>
              <tr>
                <th className="col-md-1">City</th>
                <th className="col-sm-1">Current AQI</th>
                <th className="col-md-2">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {
                lastMessage ? 
                  JSON.parse(lastMessage.data).map((data:any)=>(
                    <tr>
                      <td>{data.city}</td>
                      <td className="App-col" style={Math.round(data.aqi)<50 ? inlinestylesGood:
                        Math.round(data.aqi)>51 && Math.round(data.aqi)<=100?inlinestylesSat:
                        Math.round(data.aqi)>100 && Math.round(data.aqi)<=200?inlinestylesMod:
                        Math.round(data.aqi)>200 && Math.round(data.aqi)<=300?inlinestylesPoor:
                        Math.round(data.aqi)>300 && Math.round(data.aqi)<=400?inlinestylesVP:
                        Math.round(data.aqi)>400 && Math.round(data.aqi)<=500?inlinestylesSev:null}>
                          {parseFloat(data.aqi).toFixed(2)}</td>
                      <td>Few seconds ago</td>
                  </tr>
                  )):null
              }  
            </tbody>
          </Table>
        </div>
        <div className="col">
          <h2>Central Pollution Control Board's - Air Pollution Standards</h2>
          <Table bordered hover>
            <thead>
              <th>Color</th>
              <th>Description</th>
            </thead>
            <tbody>
              {
              standards.map((data:any)=>(
              <tr className={data.desc==='Good'?"App-Good":data.desc==='Satisfactory'?"App-Sat":
              data.desc==='Moderate'?"App-Mod":data.desc==='Poor'?"App-Poor":
              data.desc==='Very Poor'?"App-VP":data.desc==='Severe'?"App-Sev":""}>
                <td>{data.range}</td>
                <td>{data.desc}</td>
              </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div>
        <h2> Chart </h2>
          <LineChart
              width={1200}
              height={300}
              data={lastMessage ?  JSON.parse(lastMessage.data) : null}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="aqi"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            </LineChart>
          </div>
      </div>      
    </div>
  );
};

  export default App;