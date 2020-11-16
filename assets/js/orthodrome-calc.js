/*
    Logic for calculating orthodrome
 */

// instrukcja();

document.addEventListener('readystatechange', event => {
    // When HTML/DOM elements are ready:
    if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
        instrukcja();
    }
});


$(function () {
    $('form').each(function () {
        $(this).find('input').keypress(function (e) {
            // Enter pressed?
            if (e.keyCode === 10 || e.keyCode === 13) {
                calculate(this.form)
            }
        });

        $(this).find('input[type=submit]').hide();
    });
});


//---funkcja czyszcząca stronę po naciśnięciu guzika---//
function fClear(form) {
    //---zerowaniu punktu A
    form.a_szer_kat.value = ""
    form.a_szer_min.value = ""
    form.a_szer_strona.value = "N"
    form.a_dlug_kat.value = ""
    form.a_dlug_min.value = ""
    form.a_dlug_strona.value = "E"

    //---zerowaniu punktu B
    form.b_szer_kat.value = ""
    form.b_szer_min.value = ""
    form.b_szer_strona.value = "N"
    form.b_dlug_kat.value = ""
    form.b_dlug_min.value = ""
    form.b_dlug_strona.value = "E"

    //---czyszczenie miejsca na
    //---obliczanie i komentarz
    form.komentarz.value = ""
    form.komentarz_obl.value = ""
}

//-----------------------------------------------------//


//----Funkcje zamieniajace N/S i E/W----//
function changeNorthSouth(strona) {
    if (strona.value == "N") {
        strona.value = "S"
    } else {
        strona.value = "N"
    }
}

function changeEastWest(strona) {
    if (strona.value == "E") {
        strona.value = "W"
    } else {
        strona.value = "E"
    }
}

//--------------------------------------//


//----zerowanie niewprowadzonych do formularza wartości----//
function fillEmptyWithZeros(invalue) {
    if (invalue.value == null || invalue.value.length == 0) {
        invalue.value = 0
    }
}

//---------------------------------------------------------//


//----przeliczanie stopni do formatu dziesiętnego----//
function decimalToDegrees(stopnie, minuty, strona) {
    var znak = 1

    if (strona.value == "S" || strona.value == "W")
        znak = -1

    var result = eval((eval(stopnie) + eval(minuty / 60)) * znak)
    return result
}

//---------------------------------------------------//


//------wypisanie wartości kątów w formacie DM 000°00.0'------//
//------------------------------------------------------------//
function decimalToDegreesAsText(wartosc) {
    var wartosc_kat = Math.floor(Math.abs(wartosc))
    var wartosc_min = (Math.abs(wartosc) - wartosc_kat) * 60

    if (Math.round(wartosc_min) == 60) {
        wartosc_min = 0
        wartosc_kat++
    }

    var katy = ''
    var miny = ''

    var result = ''

    if (wartosc < 0)
        result += '-'

    if (wartosc >= 0)
        katy += ' '

    if (wartosc_kat < 100) {
        katy += '0'
        if (wartosc_kat < 10)
            katy += '0'
    }

    if (wartosc_min < 10)
        miny += '0'

    result += katy + wartosc_kat + '°' + miny + wartosc_min.toFixed(1) + "'"
    return result
}

//------------------------------------------------------------//


//------wypisanie wartości kątów w formacie DM 00°00.0'------//
function decimalToDegreesForLatitude(wartosc) {
    var wartosc_kat = Math.floor(Math.abs(wartosc))
    var wartosc_min = (Math.abs(wartosc) - wartosc_kat) * 60

    var katy = ''
    var miny = ''

    var result = ''

    if (wartosc < 0)
        result += '-'

    if (wartosc >= 0)
        katy += ' '

    if (wartosc_kat < 10)
        katy += '0'

    if (wartosc_min < 10)
        miny += '0'

    result += katy + wartosc_kat + '°' + miny + wartosc_min.toFixed(1) + "'"
    return result
}

//-----------------------------------------------------------//


//--------------walidacja danych--------------//
function validate(a_szer, a_szer_kat, a_szer_min, a_dlug, a_dlug_kat, a_dlug_min, b_szer, b_szer_kat, b_szer_min, b_dlug, b_dlug_kat, b_dlug_min) {

    var i = 0

    if ((a_szer < 0 || a_szer > 90) || (a_szer_min < 0 || a_szer_min >= 60) || Math.floor(a_szer_kat) - a_szer_kat != 0)
        i++

    if ((b_szer < 0 || b_szer > 90) || (b_szer_min < 0 || b_szer_min >= 60) || Math.floor(b_szer_kat) - b_szer_kat != 0)
        i++

    if ((a_dlug < 0 || a_dlug > 180) || (a_dlug_min < 0 || a_dlug_min >= 60) || Math.floor(a_dlug_kat) - a_dlug_kat != 0)
        i++

    if ((b_dlug < 0 || b_dlug > 180) || (b_dlug_min < 0 || b_dlug_min >= 60) || Math.floor(b_dlug_kat) - b_dlug_kat != 0)
        i++

    if (i > 0) {

        form.komentarz.value += '\n'
        form.komentarz.value += ' ---------------------dane niepoprawne--------------------' + '\n\n'
        form.komentarz.value += '  Proszę o podanie poprawnych danych' + '\n\n'
        form.komentarz.value += '  Akceptowalny zakres to:' + '\n'
        form.komentarz.value += "  szerokość od 0°00.0' do  90°00.0' " + '\n'
        form.komentarz.value += "  długość   od 0°00.0' do 180°00.0' " + '\n\n'
        form.komentarz.value += "  Kąty podajemy jako liczby całkowite od 0   do 180" + '\n'
        form.komentarz.value += "  Minuty jako liczby dziesiętne       od 0.0 do 59.9" + '\n'

        form.komentarz_obl.value += '\n' + '                ----------------------------  '
        form.komentarz_obl.value += '\n' + '                ----------------------------  '
        form.komentarz_obl.value += '\n' + '                ----- niepoprawne dane -----  '
        form.komentarz_obl.value += '\n' + '                ----------------------------  '
        form.komentarz_obl.value += '\n' + '                -------- nie liczymy -------  '
        form.komentarz_obl.value += '\n' + '                ----------------------------  '
        form.komentarz_obl.value += '\n' + '                ----------------------------  '

        return 0

    } else {

        form.komentarz.value += '\n' + ' -----------dane poprawne - '

        return 1

    }

}

//--------------------------------------------//


//------------------funkcje obliczeniowe------------------------//
//------------to tutaj siedzi główna matematyka-----------------//

function wyznacz_dAB(a, b, C) {
    var a_rad = a * Math.PI / 180
    var b_rad = b * Math.PI / 180
    var C_rad = C * Math.PI / 180

    var d = 180 / Math.PI * Math.acos(Math.cos(a_rad) * Math.cos(b_rad) + Math.sin(a_rad) * Math.sin(b_rad) * Math.cos(C_rad))
    var d_rad = d * Math.PI / 180

    var A = 180 / Math.PI * Math.acos((Math.cos(a_rad) - Math.cos(b_rad) * Math.cos(d_rad)) / (Math.sin(b_rad) * Math.sin(d_rad)))

    var B = 180 / Math.PI * Math.acos((Math.cos(b_rad) - Math.cos(a_rad) * Math.cos(d_rad)) / (Math.sin(a_rad) * Math.sin(d_rad)))

    return [d, A, B]
}


function katy_drogi(A, B, kierunek) {
    var alfa
    var beta

    if (kierunek == 'W->E') {
        alfa = A
        beta = 180 - B
    } else {
        alfa = 360 - A
        beta = 180 + B
    }

    return [alfa, beta]
}


function wierzcholki_ortodromy(fi_A, fi_B, lambda_A, lambda_B) {
    var licznik = Math.tan(fi_A * Math.PI / 180) * Math.sin(lambda_B * Math.PI / 180) - Math.tan(fi_B * Math.PI / 180) * Math.sin(lambda_A * Math.PI / 180)
    var mianownik = Math.tan(fi_A * Math.PI / 180) * Math.cos(lambda_B * Math.PI / 180) - Math.tan(fi_B * Math.PI / 180) * Math.cos(lambda_A * Math.PI / 180)

    var lambda_r = 180 / Math.PI * Math.atan(licznik / mianownik)

    var lambda_w1 = 90 + lambda_r
    var lambda_w2 = 90 - lambda_r

    var w1_dlug_znak
    var w2_dlug_znak

    var mi

    if (lambda_w1 > 0)
        w1_dlug_znak = 'E'
    else if (lambda_w1 < 0)
        w1_dlug_znak = 'W'
    else
        w1_dlug_znak = ' '

    var w2_dlug_znak
    if (lambda_w1 > 0)
        w2_dlug_znak = 'W'
    else if (lambda_w1 < 0)
        w2_dlug_znak = 'E'
    else
        w2_dlug_znak = ' '


    if (fi_B == 0)
        mi = 180 / Math.PI * Math.atan(Math.tan(fi_A * Math.PI / 180) / Math.sin((lambda_A - lambda_r) * Math.PI / 180))
    else
        mi = 180 / Math.PI * Math.atan(Math.tan(fi_B * Math.PI / 180) / Math.sin((lambda_B - lambda_r) * Math.PI / 180))


    var w1_szer_znak
    if (mi > 0)
        w1_szer_znak = 'N'
    else if (mi < 0)
        w1_szer_znak = 'S'
    else
        w1_szer_znak = ' '

    var w2_szer_znak
    if (mi > 0)
        w2_szer_znak = 'S'
    else if (mi < 0)
        w2_szer_znak = 'N'
    else
        w2_szer_znak = ' '

    return [lambda_w1, lambda_w2, mi, w1_szer_znak, w1_dlug_znak, w2_szer_znak, w2_dlug_znak]
}


//--------funkcje wypisujące wyniki--------//
function wypis_wspolrzednych_AB(fi_A, fi_B, lambda_A, lambda_B) {
    form.komentarz_obl.value += '\n'
        + ' -----przeliczone szerokości/długości punktów A oraz B----\n'
        + '  φ_A = ' + decimalToDegreesForLatitude(fi_A) + '\t' + 'λ_A = ' + decimalToDegreesAsText(lambda_A) + '\n'
        + '  φ_B = ' + decimalToDegreesForLatitude(fi_B) + '\t' + 'λ_B = ' + decimalToDegreesAsText(lambda_B) + '\n'
        + ' ---------------------------------------------------------\n\n'
}

function komentarz_tekst(fi_A, fi_B, lambda_A, lambda_B, a, b, ortodroma, A, B, C, alfa, beta, kierunek, h1, h2, loksodroma) {

    form.komentarz_obl.value += ' --------podstawowe długości oraz kąty w trójkącie--------\n'
        + '  a =' + decimalToDegreesAsText(a) + '\n'
        + '  b =' + decimalToDegreesAsText(b) + '\n\n'

        + '  C =' + decimalToDegreesAsText(C) + '\n'

        + '  A =' + decimalToDegreesAsText(A) + '             h =' + decimalToDegreesAsText(h1) + '  v ' + decimalToDegreesAsText(h2) + '\n'
        + '  B =' + decimalToDegreesAsText(B) + '\n'
        + ' ---------------------------------------------------------\n\n'

        + ' -----------------odległość ortodromiczna-----------------\n'
        + '  d =' + decimalToDegreesAsText(ortodroma) + ' = ' + (ortodroma * 60).toFixed(2) + ' Mm' + '\n'
        + ' ---------------------------------------------------------\n\n'

        + ' -----------------odległość loksodromiczna----------------\n'
        + '  s =             ' + loksodroma.toFixed(2) + ' Mm' + '\n'
        + ' ---------------------------------------------------------\n\n'

        + ' ------------------------kąty drogi-----------------------\n'
        + '  α =' + decimalToDegreesAsText(alfa) + '\n'
        + '  β =' + decimalToDegreesAsText(beta) + '\n'
        + ' ---------------------------------------------------------\n\n'

    form.komentarz.value += '\n\n\n\n\n\n\n\n\n\n'

    if ((A < 90 && B < 90) || (A > 90 && B > 90))
        form.komentarz.value += '- Kąty A,B są jednorodne, więc wysokość leży' + '\n' + '  wewnątrz trójkąta' + '\n'

    else if ((A > 90 && B < 90) || (A < 90 && B > 90))
        form.komentarz.value += '- Kąty A,B są niejednorodne, więc wysokość leży' + '\n' + '  na zewnątrz trójkąta' + '\n'


    else if (A == 90)
        form.komentarz.value += '- Kąt A jest kątem prostym, więc wysokość pokrywa się z bokiem b' + '\n'

    else if (B == 90)
        form.komentarz.value += '- Kąt B jest kątem prostym, więc wysokość pokrywa się z bokiem a' + '\n'


    var zysk = loksodroma - ortodroma * 60

    form.komentarz.value += '\n\n\n\n\n\n\n'
    form.komentarz.value += '- zysk z płynięcia po ortodromie wynosi ' + zysk.toFixed(2) + ' Mm.'
    form.komentarz.value += '\n\n'


    form.komentarz.value += '\n\n' + '- Płyniemy w kierunku ' + kierunek + '\n'


}

//-----------------------------------------//


//------------analiza szczególnych przypadków:----------------//
//            - poruszanie się po równiku
//            - poruszanie się po południku
//            - wpisanie tego samego punktu
//            - przepłynięcie połowy obwodu kuli ziemskiej
//------------------------------------------------------------//

function szczegolny_przypadek_rownik(fi_A, fi_B, lambda_A, lambda_B, a, b, C, ortodroma, alfa, beta) {

    form.komentarz.value += 'przypadek szczególny----------' + '\n'
        + ' -----------------poruszamy się po równiku----------------' + '\n\n\n\n\n\n\n\n\n'

        + '- W przypadku poruszania się po równiku trójkąt sferyczny' + '\n'
        + '  posiada dwa kąty proste (przy punktach A,B)' + '\n\n\n\n\n\n\n\n'

    form.komentarz_obl.value += ' --------podstawowe długości oraz kąty w trójkącie--------\n'
        + '  a =' + decimalToDegreesAsText(a) + '\n'
        + '  b =' + decimalToDegreesAsText(b) + '\n\n'

        + '  C =' + decimalToDegreesAsText(C) + '\n'

        + '  A =' + " 090°00.0'" + "             h = 090°00.0'" + '\n'
        + '  B =' + " 090°00.0'" + '\n'
        + ' ---------------------------------------------------------\n\n'

        + ' -----------------odległość ortodromiczna-----------------\n'
        + '  d =' + decimalToDegreesAsText(ortodroma) + ' = ' + (ortodroma * 60).toFixed(2) + ' Mm' + '\n'
        + ' ---------------------------------------------------------\n\n'

        + ' -----------------odległość loksodromiczna----------------\n'
        + '  s =             ' + (ortodroma * 60).toFixed(2) + ' Mm' + '\n'
        + ' ---------------------------------------------------------\n\n'

        + ' ------------------------kąty drogi-----------------------\n'

    form.komentarz.value += '- w przypadku poruszania się równiku ortodroma jest\n'
    form.komentarz.value += '  jednocześnie loksodromą\n\n\n'


    if (lambda_A > lambda_B) {
        form.komentarz.value += "- Kąt drogi wynosi stale 270°00.0' (prosto na zachód)" + '\n\n\n\n\n'

        form.komentarz_obl.value += '  α =' + " 270°00.0'" + '\n'
            + '  β =' + " 270°00.0'" + '\n'
    }

    if (lambda_A < lambda_B) {
        form.komentarz.value += "- Kąt drogi wynosi stale  90°00.0' (prosto na wschód)" + '\n\n\n\n\n'

        form.komentarz_obl.value += '  α =' + " 090°00.0'" + '\n'
            + '  β =' + " 090°00.0'" + '\n'
    }

    form.komentarz_obl.value += ' ---------------------------------------------------------\n\n'

    form.komentarz.value += '- Wierzchołkami ortodromy są wszystkie punkty' + '\n'
        + '  leżące na równiku' + '\n'

    form.komentarz_obl.value += ' -------------------wierzchołki ortodromy-----------------\n'
        + "  W  ( 0°00.0' ; xxx°xx.x' E/W ) " + '\n'
        + "    każdy punkt leżący na równiku " + '\n'
        + ' ---------------------------------------------------------\n\n'

}


function szczegolny_przypadek_poludnik(fi_A, fi_B, lambda_A, lambda_B, a, b, C, ortodroma, alfa, beta) {

    form.komentarz.value += 'przypadek szczególny----------' + '\n'
        + ' ----------------poruszamy się po południku---------------' + '\n\n\n\n\n\n\n\n\n'

    form.komentarz.value += '- W przypadku poruszania się po południku trójkąt' + '\n'
    form.komentarz.value += '  sferyczny abdABC nie istnieje, więc nie liczymy' + '\n'
    form.komentarz.value += '  kątów A, B oraz h' + '\n\n\n\n\n\n\n'

    form.komentarz_obl.value += ' --------podstawowe długości oraz kąty w trójkącie--------\n'
    form.komentarz_obl.value += '  a =' + decimalToDegreesAsText(a) + '\n'
    form.komentarz_obl.value += '  b =' + decimalToDegreesAsText(b) + '\n\n'

    form.komentarz_obl.value += '  C =' + " 000°00.0'" + '\n'

    form.komentarz_obl.value += '  A =' + ' nie liczymy' + '           h = nie liczymy' + '\n'
    form.komentarz_obl.value += '  B =' + ' nie liczymy' + '\n'
    form.komentarz_obl.value += ' ---------------------------------------------------------\n\n'

    form.komentarz_obl.value += ' -----------------odległość ortodromiczna-----------------\n'
    form.komentarz_obl.value += '  d =' + decimalToDegreesAsText(ortodroma) + ' = ' + (ortodroma * 60).toFixed(2) + ' Mm' + '\n'
    form.komentarz_obl.value += ' ---------------------------------------------------------\n\n'

        + ' -----------------odległość loksodromiczna----------------\n'
        + '  s =             ' + (ortodroma * 60).toFixed(2) + ' Mm' + '\n'
        + ' ---------------------------------------------------------\n\n'

    form.komentarz.value += '- w przypadku poruszania się południku ortodroma jest\n'
    form.komentarz.value += '  jednocześnie loksodromą\n\n\n'

    form.komentarz_obl.value += ' ------------------------kąty drogi-----------------------\n'

    if (fi_A > fi_B) {
        form.komentarz.value += "- Kąt drogi wynosi stale 180°00.0' (prosto na południe)" + '\n\n\n'

        form.komentarz_obl.value += '  α =' + " 180°00.0'" + '\n'
        form.komentarz_obl.value += '  β =' + " 180°00.0'" + '\n'
    }

    if (fi_A < fi_B) {
        form.komentarz.value += "- Kąt drogi wynosi stale   0°00.0' (prosto na północ)" + '\n\n\n'

        form.komentarz_obl.value += '  α =' + " 000°00.0'" + '\n'
        form.komentarz_obl.value += '  β =' + " 000°00.0'" + '\n'
    }

    form.komentarz_obl.value += ' ---------------------------------------------------------\n\n'


    form.komentarz.value += '\n\n'

    form.komentarz.value += '- Wierzchołkami ortodromy są odpowiednio' + '\n'
    form.komentarz.value += '  biegun północny oraz biegun południowy' + '\n'


    form.komentarz_obl.value += ' -------------------wierzchołki ortodromy-----------------\n'
    form.komentarz_obl.value += "  W1 ( 90°00.0' N ) - biegun północny     " + '\n'
    form.komentarz_obl.value += "  W2 ( 90°00.0' S ) - biegun południowy   " + '\n'
    form.komentarz_obl.value += ' ---------------------------------------------------------\n\n'

}


function szczegolny_przypadek_punkt(fi_A, fi_B, lambda_A, lambda_B) {

    form.komentarz.value += 'przypadek szczególny----------' + '\n'
        + ' -----------------podano takie same punkty----------------' + '\n\n'
        + ' -------czyli w ogóle nie płyniemy i nic nie liczymy------' + '\n'

}

function szczegolny_przypadek_naprzeciwko(fi_A, fi_B, lambda_A, lambda_B, a, b, ortodroma) {

    form.komentarz.value += 'przypadek szczególny----------' + '\n'
        + ' ----------------punkty naprzeciwko siebie----------------' + '\n\n'
    form.komentarz.value += ' Do przepłynięcia jest pół świata. Najprostszym sposobem' + '\n'
    form.komentarz.value += ' jest płynięcie po południku' + '\n\n\n\n\n\n'
    form.komentarz.value += '- do wyboru jest nieskończenie wiele ortodrom' + '\n'
    form.komentarz.value += '  więc nie wyznaczamy kątów A, B oraz h' + '\n\n\n\n'

    form.komentarz.value += "- Odległość ortodromiczna to połowa obwodu Ziemi" + '\n\n\n\n'

    form.komentarz.value += '- w przypadku poruszania się południku ortodroma jest\n'
    form.komentarz.value += '  jednocześnie loksodromą\n\n\n'

    form.komentarz.value += "- Kąt drogi wynosi stale 180°00.0' (prosto na południe)" + '\n'
    form.komentarz.value += "  lub stale                0°00.0' (prosto na północ)" + '\n\n\n\n'

    form.komentarz.value += '- W przyjętym przez nas przypadku wierzchołkami ortodromy' + '\n'
    form.komentarz.value += '  są odpowiednio biegun północny oraz biegun południowy' + '\n'


    form.komentarz_obl.value += ' --------podstawowe długości oraz kąty w trójkącie--------\n'
    form.komentarz_obl.value += '  a =' + decimalToDegreesAsText(a) + '\n'
    form.komentarz_obl.value += '  b =' + decimalToDegreesAsText(b) + '\n\n'

    form.komentarz_obl.value += '  C =' + " 180°00.0'" + '\n'

    form.komentarz_obl.value += '  A =' + ' nie liczymy' + '           h = nie liczymy' + '\n'
    form.komentarz_obl.value += '  B =' + ' nie liczymy' + '\n'
    form.komentarz_obl.value += ' ---------------------------------------------------------\n\n'

    form.komentarz_obl.value += ' -----------------odległość ortodromiczna-----------------\n'
    form.komentarz_obl.value += '  d =' + decimalToDegreesAsText(ortodroma) + ' = ' + (ortodroma * 60).toFixed(2) + ' Mm' + '\n'
    form.komentarz_obl.value += ' ---------------------------------------------------------\n\n'

        + ' -----------------odległość loksodromiczna----------------\n'
        + '  s =             ' + (ortodroma * 60).toFixed(2) + ' Mm' + '\n'
        + ' ---------------------------------------------------------\n\n'

    form.komentarz_obl.value += ' ------------------------kąty drogi-----------------------\n'
    form.komentarz_obl.value += '  α =' + " 000°00.0' / 180°00.0'" + '\n'
    form.komentarz_obl.value += '  β =' + " 000°00.0' / 180°00.0'" + '\n'
    form.komentarz_obl.value += ' ---------------------------------------------------------\n\n'

    form.komentarz_obl.value += ' -------------------wierzchołki ortodromy-----------------\n'
    form.komentarz_obl.value += "  W1 ( 90°00.0' N ) - biegun północny     " + '\n'
    form.komentarz_obl.value += "  W2 ( 90°00.0' S ) - biegun południowy   " + '\n'
    form.komentarz_obl.value += ' ---------------------------------------------------------\n\n'

}


function instrukcja() {

    form.komentarz_obl.value = ''
        + '\n'
        + '  -------------------Kalkulator Ortodromy-----------------' + '\n\n'
        + '  -----------------------O PROGRAMIE----------------------' + '\n\n'
        + '  Program wyznaczający podstawowe parametry ortodromy' + '\n'
        + '  mając dane współrzędne geograficzne dwóch punktów A,B:' + '\n\n'
        + '  - odległość ortodromiczną (w stopniach oraz Mm),' + '\n'
        + '  - początkowy oraz końcowy kąt drogi,' + '\n'
        + '  - współrzędne wierzchołków ortodromy.' + '\n\n'
        + '  Dodatkowo program oblicza i wypisuje wszystkie parametry ' + '\n'
        + '  wymagane do obliczeń.'


    form.komentarz.value = ''
        + '\n\n\n'
        + '  -----------------------INSTRUKCJA-----------------------' + '\n\n'
        + '  Akceptowalny zakres danych wejściowych to:' + '\n\n'

        + "  szerokość od 0°00.0' do  90°00.0' " + '\n'
        + "  długość   od 0°00.0' do 180°00.0' " + '\n\n'
        + "  Kąty podajemy jako liczby całkowite od 0   do 180  " + '\n'
        + "  Minuty jako liczby dziesiętne       od 0.0 do  59.9"

}


//----------najważniejsza funkcja - wywołanie wszystkich obliczeń----------//
function calculate(form) {

    //-----zerowanie niewprowadzonych elementów-----//
    fillEmptyWithZeros(form.a_szer_kat)
    fillEmptyWithZeros(form.a_szer_min)
    fillEmptyWithZeros(form.a_dlug_kat)
    fillEmptyWithZeros(form.a_dlug_min)
    fillEmptyWithZeros(form.b_szer_kat)
    fillEmptyWithZeros(form.b_szer_min)
    fillEmptyWithZeros(form.b_dlug_kat)
    fillEmptyWithZeros(form.b_dlug_min)
    //----------------------------------------------//


    //-----zerowanie okienek komentarzy-----//
    form.komentarz.value = ""
    form.komentarz_obl.value = ""
    //--------------------------------------//


    //-----wczytywanie danych wejściowych-----//
    var a_szer_kat = form.a_szer_kat.value
    var a_szer_min = form.a_szer_min.value
    var a_dlug_kat = form.a_dlug_kat.value
    var a_dlug_min = form.a_dlug_min.value

    var b_szer_kat = form.b_szer_kat.value
    var b_szer_min = form.b_szer_min.value
    var b_dlug_kat = form.b_dlug_kat.value
    var b_dlug_min = form.b_dlug_min.value
    //----------------------------------------//


    //-----przeliczanie wprowadzonych wartości na format dziesiętny-----//
    var a_szer = eval(a_szer_kat) + eval(a_szer_min / 60)
    var a_dlug = eval(a_dlug_kat) + eval(a_dlug_min / 60)

    var b_szer = eval(b_szer_kat) + eval(b_szer_min / 60)
    var b_dlug = eval(b_dlug_kat) + eval(b_dlug_min / 60)
    //------------------------------------------------------------------//


    //-----wywołanie funkcji walidującej dane wejściowe-----//
    var wal = validate(a_szer, a_szer_kat, a_szer_min, a_dlug, a_dlug_kat, a_dlug_min, b_szer, b_szer_kat, b_szer_min, b_dlug, b_dlug_kat, b_dlug_min)

    if (wal == 1) {

        //-----przeliczenie współrzędnych z uwzględnieniem konwencji znaków-----//
        var fi_A = decimalToDegrees(a_szer_kat, a_szer_min, form.a_szer_strona)
        var fi_B = decimalToDegrees(b_szer_kat, b_szer_min, form.b_szer_strona)

        var lambda_A = decimalToDegrees(a_dlug_kat, a_dlug_min, form.a_dlug_strona)
        var lambda_B = decimalToDegrees(b_dlug_kat, b_dlug_min, form.b_dlug_strona)
        //----------------------------------------------------------------------//

        wypis_wspolrzednych_AB(fi_A, fi_B, lambda_A, lambda_B)


        //-----wyznaczenie długości a,b-----//
        var a = 90 - fi_B
        var b = 90 - fi_A
        //----------------------------------//


        //-----wyznaczenie kąta C-----//
        var C_pom = Math.abs(lambda_B - lambda_A)
        var C

        if (C_pom <= 180)
            C = C_pom
        else
            C = 360 - C_pom
        //----------------------------//


        //-----ustalenie kierunku drogi-----//
        var delta_lambda = lambda_B - lambda_A
        var suma_fi = fi_B + fi_A
        var kierunek = ''

        if ((delta_lambda > 0 && delta_lambda < 180) || (delta_lambda < -180 && delta_lambda > -360))
            kierunek = 'W->E'
        else if ((delta_lambda < 0 && delta_lambda > -180) || (delta_lambda > 180 && delta_lambda < 360))
            kierunek = 'E->W'
        else if ((delta_lambda == 180 || delta_lambda == -180) && (suma_fi == 0))
            kierunek = 'obojetnie'
        else
            kierunek = 'nie wiem'
        //----------------------------------//


        //-----wyznaczenie kątów A,B oraz długości ortodromy-----//
        var dAB = []
        dAB = wyznacz_dAB(a, b, C)

        var ortodroma = dAB[0]
        var A = dAB[1]
        var B = dAB[2]
        //-------------------------------------------------------//


        //-----wyznaczenie kątów drogi-----//
        var katy = []
        katy = katy_drogi(A, B, kierunek)

        var alfa = katy[0]
        var beta = katy[1]
        //---------------------------------//


        //-----zweryfikowanie szczególnych przypadków-----//
        if (((delta_lambda == 180 || delta_lambda == -180) && (suma_fi == 0)) || (lambda_A == 0 && lambda_B == 0 && suma_fi == 0))
            szczegolny_przypadek_naprzeciwko(fi_A, fi_B, lambda_A, lambda_B, a, b, ortodroma)

        else if (lambda_A == lambda_B && fi_A == fi_B)
            szczegolny_przypadek_punkt(fi_A, fi_B, lambda_A, lambda_B)

        else if (fi_A == 0 && fi_B == 0)
            szczegolny_przypadek_rownik(fi_A, fi_B, lambda_A, lambda_B, a, b, C, ortodroma, alfa, beta)

        else if ((lambda_A == lambda_B) || (delta_lambda == 180 || delta_lambda == -180))
            szczegolny_przypadek_poludnik(fi_A, fi_B, lambda_A, lambda_B, a, b, C, ortodroma, alfa, beta)

        else if (Math.abs(fi_A) == 90 || Math.abs(fi_B) == 90)
            szczegolny_przypadek_poludnik(fi_A, fi_B, lambda_A, lambda_B, a, b, C, ortodroma, alfa, beta)
            //------------------------------------------------//

        //-----przypadek ogólny----//
        else {

            form.komentarz.value += 'przypadek ogólny--------------'


            var wierzcholki_ort = []
            wierzcholki_ort = wierzcholki_ortodromy(fi_A, fi_B, lambda_A, lambda_B)

            var lambda_w1 = wierzcholki_ort[0]
            var lambda_w2 = wierzcholki_ort[1]
            var mi = wierzcholki_ort[2]

            var W1_NS = wierzcholki_ort[3]
            var W1_EW = wierzcholki_ort[4]
            var W2_NS = wierzcholki_ort[5]
            var W2_EW = wierzcholki_ort[6]

            var h1 = 90 - Math.abs(mi)
            var h2 = 180 - h1

            //loksodroma - zfunkcjować później!!--------//
            var fi_A_rad = fi_A * Math.PI / 180
            var fi_B_rad = fi_B * Math.PI / 180

            var delta_fi_rad = (fi_B - fi_A) * Math.PI / 180
            var delta_lambda_rad = delta_lambda * Math.PI / 180

            var delta_psi = Math.log(Math.tan(Math.PI / 4 + fi_B_rad / 2) / Math.tan(Math.PI / 4 + fi_A_rad / 2));
            var q = Math.abs(delta_psi) > 10e-12 ? delta_fi_rad / delta_psi : Math.cos(fi_A_rad);

            if (Math.abs(delta_lambda_rad) > Math.PI) delta_lambda_rad = delta_lambda_rad > 0 ? -(2 * Math.PI - delta_lambda_rad) : (2 * Math.PI + delta_lambda_rad);

            var loksodroma = Math.sqrt(delta_fi_rad * delta_fi_rad + q * q * delta_lambda_rad * delta_lambda_rad) * 3440;
            //------------------------------------------//

            komentarz_tekst(fi_A, fi_B, lambda_A, lambda_B, a, b, ortodroma, A, B, C, alfa, beta, kierunek, h1, h2, loksodroma)

            form.komentarz_obl.value += ' -------------------wierzchołki ortodromy-----------------\n'
            form.komentarz_obl.value += '  W1 (' + decimalToDegreesForLatitude(Math.abs(mi)) + ' ' + W1_NS + ' ;' + decimalToDegreesAsText(Math.abs(lambda_w1)) + ' ' + W1_EW + ' )\n'
            form.komentarz_obl.value += '  W2 (' + decimalToDegreesForLatitude(Math.abs(mi)) + ' ' + W2_NS + ' ;' + decimalToDegreesAsText(Math.abs(lambda_w2)) + ' ' + W2_EW + ' )\n'
            form.komentarz_obl.value += ' ---------------------------------------------------------\n'


        }

    }

}


//przypadki ogólne//


//przyklad_01     A(10°N;050°E) -> B(20°N;170°E)
function przyklad_01(form) {
    fClear(this.form)

    form.a_szer_kat.value = "10"
    form.a_szer_strona.value = "N"
    form.a_dlug_kat.value = "50"
    form.a_dlug_strona.value = "E"

    form.b_szer_kat.value = "20"
    form.b_szer_strona.value = "N"
    form.b_dlug_kat.value = "170"
    form.b_dlug_strona.value = "E"

    calculate(this.form)

}

//przyklad_02     A(50°N;020°W) -> B(50°N;090°E)
function przyklad_02(form) {
    fClear(this.form)

    form.a_szer_kat.value = "50"
    form.a_szer_strona.value = "N"
    form.a_dlug_kat.value = "20"
    form.a_dlug_strona.value = "W"

    form.b_szer_kat.value = "50"
    form.b_szer_strona.value = "N"
    form.b_dlug_kat.value = "90"
    form.b_dlug_strona.value = "E"

    calculate(this.form)

}

//przyklad_03     A(50°N;030°E) -> B(30°N;060°E)
function przyklad_03(form) {
    fClear(this.form)

    form.a_szer_kat.value = "50"
    form.a_szer_strona.value = "N"
    form.a_dlug_kat.value = "30"
    form.a_dlug_strona.value = "E"

    form.b_szer_kat.value = "30"
    form.b_szer_strona.value = "N"
    form.b_dlug_kat.value = "60"
    form.b_dlug_strona.value = "E"

    calculate(this.form)

}

//przyklad_04     A(50°N;170°W) -> B(10°S;100°W)
function przyklad_04(form) {
    fClear(this.form)

    form.a_szer_kat.value = "50"
    form.a_szer_strona.value = "N"
    form.a_dlug_kat.value = "170"
    form.a_dlug_strona.value = "W"

    form.b_szer_kat.value = "10"
    form.b_szer_strona.value = "S"
    form.b_dlug_kat.value = "100"
    form.b_dlug_strona.value = "W"

    calculate(this.form)

}

//przyklad_05     A(30°S;060°E) -> B(40°S;140°E)
function przyklad_05(form) {
    fClear(this.form)

    form.a_szer_kat.value = "30"
    form.a_szer_strona.value = "S"
    form.a_dlug_kat.value = "60"
    form.a_dlug_strona.value = "E"

    form.b_szer_kat.value = "40"
    form.b_szer_strona.value = "S"
    form.b_dlug_kat.value = "140"
    form.b_dlug_strona.value = "E"

    calculate(this.form)

}

//przyklad_06     A(20°S;100°W) -> B(30°N;160°W)
function przyklad_06(form) {
    fClear(this.form)

    form.a_szer_kat.value = "20"
    form.a_szer_strona.value = "S"
    form.a_dlug_kat.value = "100"
    form.a_dlug_strona.value = "W"

    form.b_szer_kat.value = "30"
    form.b_szer_strona.value = "N"
    form.b_dlug_kat.value = "160"
    form.b_dlug_strona.value = "W"

    calculate(this.form)

}

//przyklad_07     A( 0° ;070°E) -> B(20°S;120°W)
function przyklad_07(form) {
    fClear(this.form)

    form.a_szer_kat.value = "0"
    form.a_szer_strona.value = "N"
    form.a_dlug_kat.value = "70"
    form.a_dlug_strona.value = "E"

    form.b_szer_kat.value = "20"
    form.b_szer_strona.value = "S"
    form.b_dlug_kat.value = "120"
    form.b_dlug_strona.value = "W"

    calculate(this.form)

}

//przyklad_08     A(40°S;090°W) -> B( 0° ;130°W)
function przyklad_08(form) {
    fClear(this.form)

    form.a_szer_kat.value = "40"
    form.a_szer_strona.value = "S"
    form.a_dlug_kat.value = "90"
    form.a_dlug_strona.value = "W"

    form.b_szer_kat.value = "0"
    form.b_szer_strona.value = "N"
    form.b_dlug_kat.value = "130"
    form.b_dlug_strona.value = "W"

    calculate(this.form)

}


//przypadki szczególne//


//przykład_11    A(90°N      ) -> B(90°S      )
function przyklad_11(form) {
    fClear(this.form)

    form.a_szer_kat.value = "90"
    form.a_szer_strona.value = "N"
    form.a_dlug_kat.value = "0"
    form.a_dlug_strona.value = "E"

    form.b_szer_kat.value = "90"
    form.b_szer_strona.value = "S"
    form.b_dlug_kat.value = "0"
    form.b_dlug_strona.value = "E"

    calculate(this.form)

}

//przykład_12    A(40°N;030°E) -> B(40°S;150°W)
function przyklad_12(form) {
    fClear(this.form)

    form.a_szer_kat.value = "40"
    form.a_szer_strona.value = "N"
    form.a_dlug_kat.value = "30"
    form.a_dlug_strona.value = "E"

    form.b_szer_kat.value = "40"
    form.b_szer_strona.value = "S"
    form.b_dlug_kat.value = "150"
    form.b_dlug_strona.value = "W"

    calculate(this.form)

}


//przykład_13    A(20°N;030°E) -> B(40°S;030°E)
function przyklad_13(form) {
    fClear(this.form)

    form.a_szer_kat.value = "20"
    form.a_szer_strona.value = "N"
    form.a_dlug_kat.value = "30"
    form.a_dlug_strona.value = "E"

    form.b_szer_kat.value = "40"
    form.b_szer_strona.value = "S"
    form.b_dlug_kat.value = "30"
    form.b_dlug_strona.value = "E"

    calculate(this.form)

}


//przykład_14    A( 0° ;010°E)<br>B( 0° ;050°W)
function przyklad_14(form) {
    fClear(this.form)

    form.a_szer_kat.value = "0"
    form.a_szer_strona.value = "N"
    form.a_dlug_kat.value = "10"
    form.a_dlug_strona.value = "E"

    form.b_szer_kat.value = "0"
    form.b_szer_strona.value = "S"
    form.b_dlug_kat.value = "50"
    form.b_dlug_strona.value = "W"

    calculate(this.form)

}

