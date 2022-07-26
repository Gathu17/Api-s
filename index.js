window.onload=() => {
    function getEl(selector) {
        return document.querySelector(selector)
    }
    function disable(el) {
        el.disabled=true;
    }
    function empty(el) {
        el.innerHTML = "";
    }
    function remDisable(el) {
        el.disabled = false;
    }
    function prevent(e) {
        e.preventDefault();
    }
    const toggleBtn= getEl(".toggle-rect");
    const body = document.body;
    const mainA = document.querySelectorAll(".links a");
    const backBtn = getEl(".back");
    const dic = getEl(".dic");
    const age = getEl(".age");
    const country = getEl(".country");
    const dicForm = dic.querySelector("form");
    const ageForm = getEl(".age form");
    const countryForm = country.querySelector("form")
    const ageEl = getEl(".age-counter");
    const ageIn = getEl("#age-input")
    const dicIn = getEl("#dic-input");
    const cntIn = getEl("#country-input");
    const link = getEl(".links");

    function adjust(e, res ,load , ext="dic-result-ext" ) {
        body.classList.add("remove");
        getEl(res).classList.remove(ext);
        empty(getEl(load));
    }
    dicIn.addEventListener("focus", (e)=> adjust(e, ".dic-result", ".loader-container"));
    dicIn.addEventListener("blur", ()=> {body.classList.remove("remove"); });
    ageIn.addEventListener("focus", ()=>{
        body.classList.add("remove");
        getEl(".grid-age").classList.add("img-exp")
    })
    ageIn.addEventListener("blur", ()=> {
        body.classList.remove("remove");
        getEl(".grid-age").classList.remove("img-exp")
    })
    cntIn.addEventListener("focus", (e)=> adjust(e, ".country-result", ".country-loader-container", "country-result-ext"));
    cntIn.addEventListener("blur", ()=> {
        body.classList.remove("remove");
    })
    setTimeout(()=> {
        getEl("#global-loader").style.display="none";
        alert("Hi")
    },2000);
    dic.classList.add("hide");
     age.classList.add("hide");
    country.classList.add("hide");
    disable(dicIn);
    disable(ageIn);
    disable(cntIn);

    function removeGroup(){
        dic.classList.add("hide");
     age.classList.add("hide");
    country.classList.add("hide");
    disable(dicIn);
    disable(ageIn);
    disable(cntIn);
    }

    backBtn.addEventListener("click", ()=>{
        mainA.forEach((el)=> el.classList.remove("move"));
        removeGroup();
        backBtn.classList.remove("slideBack");
        link.style.transitionDelay = "0s";
        link.style.zIndex = "10";

        getEl(".dic-result").textContent = "";
        getEl("#dic-input").value = "";
        getEl(".dic-result").classList.remove("dic-result-ext");
        empty(getEl(".loader-container"));

        ageEl.textContent= "?";
        ageIn.value = "";
        const country = getEl(".country-result");
        const countryData = country.querySelectorAll(".country-data");
        cntIn.value = "";

        Array.from(countryData).forEach((el) =>el.textContent="")
        country.classList.remove("country-result-ext");
        empty(getEl(".country-loader-container"));

        remDisable(getEl("#dic-btn"));
        remDisable(getEl("#age-btn"));
        remDisable(getEl("#country-btn"));

    })
    toggleBtn.addEventListener("click", toggle);
    link.addEventListener("click", (e) => {
        const target =e.target;
       if (target.className==="main-links"){
           animateBtn(e)
       }
    });
    getEl("#dic-btn").addEventListener("click", getMeaning);
    getEl("#age-btn").addEventListener("click", getAge);
    getEl("#country-btn").addEventListener("click", getCountry);

    dicForm.addEventListener("submit",prevent);
    ageForm.addEventListener("submit",prevent);
    countryForm.addEventListener("submit",prevent);


    function toggle(){
        toggleBtn.classList.toggle("toggle-active");
        body.classList.toggle("body-active");
    }
    function animateBtn(e){
        e.preventDefault();
        const target = e.target;
        link.style.transitionDelay =".4s"
        link.style.zIndex = "-10";
        
        const delayArr = [".2s", ".3s", ".4s"];
        let i = 0;
        
        checkGroup(target);
        backBtn.classList.add("slideBack");

        mainA.forEach((el)=>{
           if(el!==target){
               el.style.transitionDelay= delayArr[i]
               i++;
           }
           el.classList.add("move")
        });
    }
    function checkGroup(group){
        const groupData = group.dataset.group;
        switch(groupData){
            case "dic":
                dic.classList.remove("hide");
                remDisable(dicIn)
        }
        switch(groupData){
            case "age":
                age.classList.remove("hide");
                remDisable(ageIn)
        }
        switch(groupData){
            case "country":
                country.classList.remove("hide");
                remDisable(cntIn)
        }
    }
    function createLoading(parent){
        const loaderContainer = getEl(parent);
        const loading = document.createElement ('div');
        loading.className = "loading";
        empty(loaderContainer);
        loaderContainer.append(loading);
    }
    function getMeaning(e){
        class Unknown extends Error{}
        class Invalid extends Error{}
        createLoading(".loader-container");
        disable(e.target);
        const result = getEl(".dic-result");
        result.textContent = "";
        const dicInput = getEl("#dic-input");
        const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

        const createMeaning = (data) => {
            const meaning = data[0].meanings[0].definitions[0].definition;
            const title = document.createElement('div');
            title.className = "dic-title";
            title.textContent= dicInput.value;
            const loaderContainer = getEl(".loader-container");
            empty(loaderContainer);
            loaderContainer.append(title);

            result.textContent = meaning;
            result.classList.add("dic-result-ext")
            dicInput.value= "";
        };
        const noWord = (error) => {
           result.textContent = error.message||error;
           result.classList.add("dic-result-ext");
           dicInput.value = "";
            const title = document.createElement('div');
            title.className = "dic-title";
            title.textContent= "error";
            const loaderContainer = getEl(".loader-container");
            empty(loaderContainer);
            loaderContainer.append(title);
        };
       (async function meaning(e) {
           e.preventDefault();
           try {
               const word = dicInput.value.trim();
               const regex = /^[^\d.]+$/;
               if(regex.test(word)){
                   const response = await fetch(`${url}${word}`);
                   getEl(".loading").remove();
                   if(response.ok){
                       const data = await response.json();
                       createMeaning(data);
                   }else throw new Unknown("Word not found");
               } else {throw new Invalid("Invalid input")}
           } catch (e) {
               if(e instanceof Invalid || e instanceof Unknown) noWord(e);
               else noWord("Something went wrong");
           }finally {
               remDisable(e.target);
        }
       })(e);
    }
    const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
    const extractAge = async(data) => {
        const age = data.age;
        if (age) {
            count = 0;
            while(count <= Number(age)) {
                ageEl.textContent = count;
                count++;
                await sleep(100);
            }

            }else {ageEl.textContent = "?";}
        
    }
    async function getAge(e){
        e.preventDefault();
        disable(e.target);
        const name = ageIn.value.trim();
        const url = "https://api.agify.io/?name=";

        try{
            const response = await fetch(`${url}${name}`);
            const data = await response.json();
            extractAge(data);
        }
        catch(error){

        }
        finally{
            remDisable(e.target)
        }
    }
    const inputCountryData = (data) => {
        const result = getEl(".country-result");
        result.classList.remove("country-error");
        result.classList.add("country-result-ext");

        getEl(".country-name").textContent = data.fullName;
        getEl(".country-capital").textContent = data.capital;
        getEl(".country-region").textContent = data.region;
        getEl(".country-language").textContent = data.languages.join(",");
        getEl(".country-pop").textContent = data.population;
    }
    const extractCountryData = (data,word) => {
        const {official:fullName} = data[0].name|| "Not Found";
        const capital = data[0].capital[0] || "Not Found";
        const {region} = data[0]|| "Not Found";
        const languages = Object.values(data[0].languages)|| "Not Found";
        const {population} = data[0]|| "Not Found";
    
    const obj = {
        fullName, region, population,
        capital, languages,
    }
    inputCountryData(obj);
    getEl("#country-input").value = "";
    const heading = document.createElement('h3');
    heading.textContent = word;
    const img = document.createElement('img');
    img.src = data[0].flags.png;
    console.log(img.src);
    const loaderContainer = getEl(".country-loader-container");
    empty(loaderContainer);
    loaderContainer.append(heading);
    loaderContainer.append(img);
    
}
  function noCountry(err) {
      const result = getEl(".country-result");
      result.classList.add("country-result-ext");
      result.classList.add("country-error");
      getEl(".country-error-html").style.display = "block";
      getEl(".country-error-html").textContent = err;
      getEl("#country-input").value = "";
      const title = document.createElement("div");
      title.className = "dic-error";
      title.textContent = "Error";
      const loaderContainer = getEl(".country-loader-container");
      empty(loaderContainer);
      loaderContainer.append(title);

  }
  async function getCountry(e) {
     e.preventDefault();
     disable(e.target);
     createLoading(".country-loader-container");
     try {
         const word = getEl("#country-input").value.toLowerCase().trim();
         const url = "https://restcountries.com/v3.1/name/";
         const regex = /^[^\d\?\\]+$/;
         if(regex.test(word)){
             let response  = "";
             if(word === "niger"|| word === "china"){
                 response = await fetch(`${url}${word}?fullText=true`);
                 
             }else response = await fetch(`${url}${word}`);
             if(response.ok){
                 const data = await response.json();
                 extractCountryData(data, word);
                 console.log(data[0].flags.png)

             }else {throw new Error("Failed to get country data");}

         } else {throw new Error("Invalid Input");}

     }catch(error) {
         if(error.message==="Invalid Input"|| error.message=== "Failed to get country data"){
             noCountry(error.message);
         }else noCountry("Something went wrong");
     } finally {
         remDisable(e.target);
     }
  }
}