OPTIviewer
==========
## 1. Cel aplikacji.

  Aplikacja wspomagająca proces elektronicznej inwentaryzacji oraz ewidencji majątku w przedsiębiorstwie.
Umożliwia w łatwy sposób pobranie w czasie rzeczywistym informacji zgromadzonej w bazie danych systemu.
Dane na temat obiektu majątkowego zaprezentowane w spójny i zwarty sposób są wyświetlane następnie na ekranie smartfona.

## 2. Działanie aplikacji.
  
  Po pierwszym uruchomieniu aplikacji należy wprowadzić adres URL interfejsu programistycznego aplikacji [API](https://pl.wikipedia.org/wiki/Application_Programming_Interface) oraz prywatny klucz dostępu. 
  W przypadku użycia wersji demo - patrz pt.4.

## 3. Technologie wykorzystane przy tworzeniu aplikacji.

  Aplikacja stworzona została w technologii hybrydowej składającej się z części webowej zbudowanej przy użyciu _HTML_, _CSS_ i _Java Script_ oraz części natywnej za pomocą której udostępniono wbudowane funkcje użądzenia przy wykorzystaniu pluginów Apache Cordova oraz Adobe PhoneGap. Aplikacja kompilowana w wersji pod system Adroid za pomocąAdobe PhoneGap Build.

| Technologia | Zastosowanie |
| ----------- | ------------ |
| MSSQL | System zarządzania bazą danych aplikacji | 
| SQL | Zapytania do bazy w postaci perspektyw w struktyralnym języku kwerend |
| PHP | Podłączenie do bazy, wykonanie zapytań, przetworzenie na kod wynikowy | 
| HTTP | Serwer webowy udostępnia kod wynikowy do sieci WAN |  
| API(JSON) | Wymina danych odbywa się w formacie [JSON](https://www.w3schools.com/js/js_json_intro.asp)  |
| AJAX  | _Asynchroniczna_ interaktywana wymiana danych pomiędzy aplikacją, a web service | 
| JQueryMobile | platworma programistyczna (framework) zbudowana na biblitekach Java Script |  
| Cordova, Phonegap  | Dodatkowe moduły i wyczki (plugin) wykorzystane w aplikacji |    

Local storage użyto do przechowywania konfiguracji połączenia: API URL.

## 4. Testowanie aplikacji.
* Aby przetestować działanie aplikacji bez dostępu do rzeczywistych danych, które podlegają prawnej ochronie należy użyć adresu testowego interfejsu.

> Adres API demo: http://www.su.krakow.pl/optiest-mwapi/demo.php

* W celu sprawdzenia poprawnego działania skanera kodów kreskowych / 2D można skorzystać z przykładowych etykiet umieszczonych poniżej:

### Przykładowy wygląd etykiet skanowanych za pomocą aplikacji. 

![Etykieta](http://www.su.krakow.pl/optiest-mwapi/2017-04-22%2023_23_08-Wydruk%20etykiety%20%C5%9Brodka%20trwa%C5%82ego.png "0000043086")

![Etykieta](http://www.su.krakow.pl/optiest-mwapi/2017-04-22%2023_21_06-Wydruk%20etykiety%20%C5%9Brodka%20trwa%C5%82ego.png "0000043086")

![Etykieta](http://www.su.krakow.pl/optiest-mwapi/2017-04-22%2023_18_19-Wydruk%20etykiety%20%C5%9Brodka%20trwa%C5%82ego.png "0000043086")

