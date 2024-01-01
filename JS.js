function Check_Country(nazwa){
    // Pobieram dane JSON z URL 
    return fetch("https://restcountries.com/v3.1/name/" + nazwa)
    .then(wynik => {
        if(wynik.ok){return wynik.json();}
        else        {return Promise.reject(wynik.status);} 
    })
}

function Find(){
    var val = $('#Kraj').val()

    if(val != ""){
        const kraje = Check_Country(val);

        // [[ Znaleziono ]] //
        kraje.then(wynik => {
            // Dane panstwa
            const tab = wynik[0];

            // console.log(tab);
            // Czyszczenie strony //
            $('#Sec_2').empty();
            $('#Sec_2a').empty();
            
            // Sekcja 2 dane //
            $('input').css('background-image', 'url(' + tab.flags.png + ')')

            $("#Sec_2").append(`<div id="Start"> 
                <h3> ${tab.name.official} </h3> 
                <img id='flaga' src='${tab.flags.png}'> 
            </div>`);

            if(tab.coatOfArms.png){
                $('#Start').append(`<img src='${tab.coatOfArms.png}'>`);
            }

            $("#Sec_2").append(`<div> <h4>Population: ${tab.population} </h4> </div>`);
            $("#Sec_2").append(`<div> <h4> ${tab.continents}  (${tab.subregion}) </h4> </div>`);
            $("#Sec_2").append(`<div> <h4> ${tab.capital} </h4> </div>`);
            $("#Sec_2").append(`<div> <h4> languages </h4> </div>`);
            $("#Sec_2").append(`<div> <ul id="J"> </ul> </div>`);
            $("#Sec_2").append(`<div> <h5 id="Extra"> ${tab.name.common} is independent : ${tab.independent} </h5> </div>`);
            $("#Sec_2").append(`<div> <h5 id="Extra"> ${tab.name.common} is landlock : ${tab.landlocked} </h5> </div>`);
            $("#Sec_2").append(`<div> <h4> Neighbors </h4> </div>`);
            $("#Sec_2").append(`<div> <ul id="S"> </ul> </div>`);

            // Dodaje do listy panstwa graniczace
            if(!tab.borders){
                $('#S').append(`<li> No data </li>`);
            }
            else{
                $.each(tab.borders, function(key,value){
                    $('#S').append(`<li>${value}</li>`);
                }) 
            }

            // Dodaje do listy jezyki urzedowe 
            if(!tab.languages){
                $('#J').append(`<li> No data </li>`);
            }
            else{
                $.each(tab.languages, function(key,value){
                    $('#J').append(`<li>${value}</li>`);
                }) 
            }

            // Sekcja 2a podpowiedzi //
            $("#Sec_2a").append(`<div> <h4> Suggestions </h4> </div>`);

            wynik.forEach(kraj => {
                // Tworze przycisk
                $("#Sec_2a").append(`<div id='${kraj.name.common}'> 
                    <button>${kraj.name.common} </button> <img src='${kraj.flags.png}'> 
                </div>`);

                var obj = document.getElementById(kraj.name.common);

                // Sprawdzam czy id przycisku jest takie same jak nazwa pokazywanego panstwa
                if(obj.id == tab.name.common){
                    $(obj).find('button').css('color' , 'silver');
                }

                // Dodaje event za pomoca ktorego strona zmieni wyswietlany kraj
                obj.onclick = function(){
                    document.getElementById("Kraj").value = kraj.name.official;
                    return Find();
                }
            });
    
            // Eventy //
            $("#flaga").click(function(){
                if(document.getElementById("Start_dane") == null){
                    if(tab.flags.alt){
                        $("#Start").after(`<div id="Start_dane"> <h5 id='dane_flaga'>${tab.name.common} - <br> ${tab.flags.alt}</h5> </div>`);
                    }
                    else{
                        $("#Start").after(`<div id="Start_dane"> <h5 id='dane_flaga'> No data </h5> </div>`);
                    }
                }
                else{
                    $("#Start_dane").remove();
                }
            })
        })
        
        // [[ Nie znaleziono ]] //
        kraje.catch(error => {
            console.log(error);
        })
    }
    else{
        $('#Sec_2').empty();
        $('#Sec_2a').empty();
        $('input').css('background-image', 'none');
    }
    
}

$('#Kraj').keyup(Find);