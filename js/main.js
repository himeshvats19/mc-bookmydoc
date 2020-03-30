const API_URL = 'https://api.myjson.com/bins/g5jbq'

let filters = {
    city:'',
    locality:'',
    sortByID: 'lowToHigh'
}


///Data Fetching
getData = ({city, locality, sortByID}) => {
    return fetch(API_URL)
        .then(status)
        .then(json)
        .then(function(data) {
          if(sortByID === 'lowToHigh'){
            data.sort(function(a, b){
              return a.price-b.price;
            });
          }else if(sortByID === 'highToLow'){
            data.sort(function(a, b){
              return b.price-a.price;
            });
          }
          let cities = []
            data.forEach(element => {
                if(!cities.includes(element.city)){
                    cities.push(element.city)
                }
                
          })
          //City Filtering
        if(city.length > 0){
            data = data.filter(clininc => clininc.city === city)
        }
        //Locality Filtering
        if(locality.length > 0){
            data = data.filter(clinic => clinic.locality === locality)
        }
        console.log(data);
          return {data, cities}
        }).catch(function(error) {
            console.log('Request failed', error);
    });
}
status = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }
json = (response) => {
    return response.json()
  }



///Rendering  
renderCitiesDropdown = (cities) => {
    let cityDropdown = document.querySelector('#city');
    let cityList = cities.map(el => `<option>${el}</option>`);
    cityDropdown.innerHTML += cityList;
}
renderClinincCards = (clininc) => {
    return `<div class="clininc">
        <div class="col-3">
                <img src="https://via.placeholder.com/150"/>
        </div>
        <div class="col-9">
            <h4>Name : ${clininc.name}</h4>
            <p>City : ${clininc.city}, Locality : ${clininc.locality}</p>
            <p>Price: ${clininc.price}</p>
            <p>Rating: ${clininc.rating}</p>
            <button class="book-now">Book Now</button>
        </div>
    </div>`
}
renderLocalityDropdwon = (data) => {
    let localityDropdown = document.querySelector('#locality');
    let localityList = data.map(el => `<option>${el.locality}</option>`);
    localityDropdown.innerHTML = '';
    localityDropdown.innerHTML = `<option value="default">Select</option>`;
    localityDropdown.innerHTML += localityList;
}
renderClinincs = (data) => {
    // if(!filters.locality.length > 0){
    //     renderLocalityDropdwon(data);
    // }
    data.map(clininc => {
        let clinicList = document.querySelector('#clinicLists')
        clinicList.innerHTML += renderClinincCards(clininc)
    });
}
clearList = () => {
    let clinicList = document.querySelector('#clinicLists')
    clinicList.innerHTML = ''
}


//Filters
cityDropDown = (e) => {
    const selectedCity = e.target.value
    filters.city = selectedCity;
    clearList()
    getData(filters).then(resp => {
        let { data } = resp;
        renderLocalityDropdwon(data); 
        renderClinincs(data);  
    })
}
localityDropDown = (e) => {
    const selectedLocality = e.target.value
    filters.locality = selectedLocality;
    clearList();
    getData(filters).then(resp => {
        let { data } = resp; 
        renderClinincs(data);  
    })
}
sortFilter = (e, sortByID) => {
    e.preventDefault();
    filters.sortByID = sortByID;
    clearList()
    getData(filters).then(resp => {
        let { data } = resp; 
        renderClinincs(data);  
    })
}



//ONLOAD CALL
getData(filters).then(resp => {
    let { data, cities } = resp; 
    renderCitiesDropdown(cities);
    renderClinincs(data);   
})



