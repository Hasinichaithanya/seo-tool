// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

import "./App.css"
function App() {
  const [inputUrl, setUrl] = useState('');
  const [id, setId] = useState(null);
  const [result,setResult] = useState('');
  const [loading,setLoading] = useState(false);
  const [imageURL,setImageurl] = useState("");

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(!!loading)
   if (inputUrl.length===0){
     alert("Enter Valid URL");
   }
   else{
    const post_array = [];
    post_array.push({
      "target": `${inputUrl}`,
      "max_crawl_pages": 10,
      "enable_browser_rendering":"true",
      "enable_javascript": "true",
      "load_resources": "true",
      "custom_js": "meta = {}; meta.url = document.URL; meta;",
    });

    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic aGFzaW5pY2hhaXRoYW55YTA0QGdtYWlsLmNvbTo2ZDZhMGY5NDVmMjU3ODQy', 
      },
      data: post_array,
    }

  //Task post API call
 await axios('https://api.dataforseo.com/v3/on_page/task_post', options).then(function(response){
  setId(response.data.tasks[0].id); //setting ID of the task
  }).catch(function (error) {
    console.log(error);
  });

  //Summary API call of DataForSEO
  const summary_options = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic aGFzaW5pY2hhaXRoYW55YTA0QGdtYWlsLmNvbTo2ZDZhMGY5NDVmMjU3ODQy',
    },
  }
 
    await axios(`https://api.dataforseo.com/v3/on_page/summary/${id}`,summary_options).then(function(response){
    var res = response.data.tasks[0].result[0].page_metrics//storing required data in result
    const summary_final_response = Object.entries(res);   //converting json to array
    setResult(summary_final_response);
   }).catch(function (error) {
    console.log(error);
  })

  //screenshot api call of DataForSEO
  const post_array_screenshot = [];
  post_array_screenshot.push({
    "url": `${inputUrl}`,
  });
  
      await axios({
    method: 'post',
    url: 'https://api.dataforseo.com/v3/on_page/page_screenshot',
    data: post_array_screenshot,
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Basic aGFzaW5pY2hhaXRoYW55YTA0QGdtYWlsLmNvbTo2ZDZhMGY5NDVmMjU3ODQy',
    }
  }).then(function (response) {
    var result = response['data']['tasks'][0]['result'][0]['items'];  // Result data
    setImageurl(result[0].image);
    console.log(result);
  }).catch(function (error) {
    console.log(error);
  });

  setLoading(!loading);
  }}
 
  return (
    <div className="App">
      <div>
      <h1 className="heading">SEO Widget</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL"
          value={inputUrl}
          onChange={handleUrlChange}
        />
        <button type="submit">Check SEO</button>
      </form>
      <div className='loading'>
      {loading&& "Loading....Please Wait!"}
      </div>
      {
        imageURL && <img src={imageURL} alt="screen_shot"/>
      }
      {result && (
        <div className='report'>
          <h3>SEO Audit Report</h3>
          <p>Double click to get the report</p>
          {/* Display relevant data from the API response */}
          <h4>Page Metrics</h4>
          <div className='container'>{result.map(r=>{
            if (r[0]==="checks"){
              return ""
            }else{
             return( <p className='list-item' key={r[0]}>{(r[0])+" : "+r[1]}</p>)
            }
          })}
          </div>
        </div>
      )}
    </div>
    </div>
  );
   
}

export default App;
