# PigeComm

PigeComm è il progetto finale di Colia Giuseppe e Ciccolella Giuseppe per l'esame di Fondamenti del Web.

## Indice

1. [Introduzione](#introduzione)
   * [Backend](#backend)
   * [Frontend](#frontend)
2. [Guida all'Installazione](#guida-all'installazione)
3. [Guida all'uso](#guida-all'uso)
4. [Ringraziamenti](#ringraziamenti)

## Introduzione

### Moduli Utilizzati

#### Backend
Per il Backend abbiamo utilizzato Node.js e TypeScript, coi seguenti moduli:

* **cookie-parser**: per poter utilizzare i cookie nelle richieste, necessario per la autenticazione basata su sessioni.
* **cors**: utilizzato nella fase di sviluppo per poter utilizzare backend e frontend a porte separate.
* **express**: per la gestione delle richieste e risposte all'API.
* **mongoose**: per l'interazione tra DB e backend.
* **socket.io**: per l'interazione real-time tra gli utenti.

#### Frontend
Per il Frontend abbiamo utilizzato React, coi seguenti moduli:

* **axios**: come alternativa per le fetch.
* **react-bootstrap**: per avere un interfaccia più responsiva e esteticamente gradevole.
* **js-sha256**: per la crittografia delle password.
* **socket.io-client**: per l'interazione real time tra utenti.

***

### Guida all'Installazione
Per utilizzare l'applicazione, basta eseguire i seguenti comandi nella cartella root del progetto

```
npm install
npm run build
npm run start 
```

Alternativamente, l'applicazione è disponibile al link: http://provafinalefw-hexygo.b4a.run anche se più lenta del normale, poichè limitata dalle risorse della versione gratuita di back4app.

Una volta eseguiti i due comandi, verranno installate tutte le dipendenze del frontend, che verra immediatamente buildato, e sarà pronto ad essere servito dal server Express sulla porta 3000.

### Guida all'Uso
Segue una breve overview di come utilizzare l'applicazione.

* Per potersi registrare, a partire dalla landing page, basta fare click sul link apposito.
* Sul database sono presenti due utenti di prova, oppure ci si può direttamente registrare dal frontend. I due utenti sono:
  - Mario Rossi: Username: m.rossi Password: prova123
  - Luigi Verdi: Username: l.verdi Password: prova123
* Questi due utenti hanno una conversazione disponibile per controllare il funzionamento dell'app.
* Per aggiungere un utente agli amici, bisogna fare click sull'icona in alto nella SideBar, che apre un menu dal quale si possono inviare e gestire richieste di amicizia.
* Una volta ricevuta una richiesta di amicizia, la si può accettare o rifiutare da questo stesso menu.
* Aggiunto un utente alla lista amici, comparirà nel menu alla sinistra della chat, facendo click su di lui, si aprirà la chat con l'utente.
* Una volta inviato un messaggio ad un utente, arriverà una notifica real-time a quest'ultimo, o gli comparirà al momento nella chat.
* Per rimuovere un utente dagli amici, basta fare click sull'icona della spazzatura che compare quando si passa col mouse sopra un utente, questo, aprirà un menu di conferma per l'azione.
* Per effettuare il logout, basta premere sull'icona in basso nella SideBar, questo, cancellerà la sessione, forzando un login dell'utente alla prossima richiesta, qualunque essa sia (esclusi login e logout, chiaramente).

### Ringraziamenti
Si ringraziano:

* Il Prof. Antonio Ferrara per averci dato questa occasione.
* Aurora de Pasquale per il Logo dell'app.
* [fffuel.co](http://fffuel.co) per il background della chat.