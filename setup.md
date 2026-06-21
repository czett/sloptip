# Installations- & Einrichtungsanleitung für Sloptip

Herzlich willkommen! Diese Anleitung hilft dir Schritt für Schritt dabei, **Sloptip** auf deinem Computer einzurichten und zu starten. Selbst wenn du noch nie ein Terminal (die Kommandozeile) benutzt hast, kannst du dieser Anleitung problemlos folgen.

---

## 📋 Voraussetzungen

Bevor wir beginnen, müssen zwei Programme auf deinem Computer installiert sein. Wir gehen davon aus, dass du diese bereits hast. Falls nicht, klicke auf die folgenden Links, um sie herunterzuladen und zu installieren:

1. **Git**: Ein Werkzeug, um Code herunterzuladen und zu aktualisieren.
   - [Git herunterladen](https://git-scm.com/downloads)
2. **Python (Version 3.10 oder neuer)**: Die Programmiersprache, mit der Sloptip läuft.
   - [Python herunterladen](https://www.python.org/downloads/)
   - *Wichtiger Hinweis für Windows-Nutzer:* Achte bei der Installation von Python unbedingt darauf, ganz unten im Installationsfenster das Häkchen bei **"Add python.exe to PATH"** (Python zu PATH hinzufügen) zu setzen. Das ist zwingend erforderlich, damit dein Computer die Befehle findet!

---

## 🚀 Schritt-für-Schritt-Installation

### Schritt 1: Öffne dein Terminal (die Eingabeaufforderung)

Das Terminal ist ein Textfenster, in dem du Befehle eingeben kannst.

*   **Windows**: Drücke die **Windows-Taste** auf deiner Tastatur, tippe **Eingabeaufforderung** (oder `cmd`) ein und drücke **Enter**.
*   **macOS**: Drücke **Command (⌘) + Leertaste**, um die Spotlight-Suche zu öffnen, tippe **Terminal** ein und drücke **Enter**.
*   **Linux**: Drücke die Tastenkombination **Strg + Alt + T**.

Es öffnet sich ein Fenster mit dunklem Hintergrund, in dem ein Cursor neben etwas Text blinkt.

---

### Schritt 2: Wähle den Speicherort für die App

Standardmäßig startet das Terminal in deinem persönlichen Benutzerordner. Lass uns auf den **Desktop** (Schreibtisch) wechseln, damit du den Ordner der App später leicht wiederfindest.

Gib folgenden Befehl ein und drücke **Enter**:

```bash
cd Desktop
```
*(Sollte dein Betriebssystem auf Deutsch eingestellt sein und der Befehl eine Fehlermeldung ausgeben, versuche `cd Schreibtisch`. Alternativ kannst du diesen Schritt auch überspringen).*

---

### Schritt 3: Code herunterladen (klonen)

Jetzt laden wir den Programmcode direkt von GitHub auf deinen PC herunter. Kopiere den folgenden Befehl, füge ihn in dein Terminal ein und drücke **Enter**:

```bash
git clone https://github.com/czett/wm-tippmodell.git
```

Dadurch wird auf deinem Desktop ein neuer Ordner namens `wm-tippmodell` erstellt, in dem sich alle Dateien von Sloptip befinden.

---

### Schritt 4: In den Projektordner wechseln

Damit die nächsten Befehle im richtigen Ordner ausgeführt werden, müssen wir dem Terminal sagen, dass es in diesen Ordner hineingehen soll. Gib folgenden Befehl ein und drücke **Enter**:

```bash
cd wm-tippmodell
```

Der Pfad im Terminal (der Text vor deinem blinkenden Cursor) aktualisiert sich und zeigt dir an, dass du dich jetzt im Ordner `wm-tippmodell` befindest.

---

### Schritt 5: Virtuelle Umgebung einrichten (Empfohlen)

Eine virtuelle Umgebung ist wie ein isolierter Kasten für dieses Projekt. Sie sorgt dafür, dass sich die Pakete von Sloptip nicht mit anderen Python-Programmen auf deinem Computer in die Quere kommen.

Führe den passenden Befehl für dein Betriebssystem aus:

*   **Windows**:
    ```bash
    python -m venv venv
    ```
*   **macOS / Linux**:
    ```bash
    python3 -m venv venv
    ```

> [!NOTE]
> Dieser Befehl kann einige Sekunden dauern. Sobald er fertig ist, erscheint eine neue leere Zeile für deine Eingabe.

Jetzt müssen wir diese Umgebung **aktivieren**, damit das Terminal sie auch nutzt:

*   **Windows**:
    ```cmd
    venv\Scripts\activate
    ```
*   **macOS / Linux**:
    ```bash
    source venv/bin/activate
    ```

Sobald die Umgebung aktiv ist, siehst du ein `(venv)` ganz am Anfang deiner Terminalzeile (z. B. `(venv) C:\Users\DeinName\Desktop\wm-tippmodell>`).

---

### Schritt 6: Benötigte Programmpakete installieren

Nun installieren wir **Flask** (das Web-Framework, über das Sloptip läuft) sowie alle anderen benötigten Programmierpakete. Gib diesen Befehl ein:

```bash
pip install -r requirements.txt
```
*(Solltest du auf macOS/Linux sein und der Befehl `pip` nicht funktionieren, versuche es mit `pip3 install -r requirements.txt`).*

Warte, bis die Installation abgeschlossen ist. Die benötigten Komponenten werden automatisch heruntergeladen und eingerichtet.

---

## 🏃 Anwendung starten

### Schritt 1: Den Server starten

Um die App zu starten, führst du diesen Befehl aus:

*   **Windows**:
    ```bash
    python app.py
    ```
*   **macOS / Linux**:
    ```bash
    python3 app.py
    ```

Im Terminal erscheinen nun einige Textzeilen, an deren Ende Folgendes steht:
```text
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

> [!IMPORTANT]
> **Lass dieses Terminalfenster unbedingt geöffnet!** Wenn du das Fenster schließt oder die Tastenkombination `Strg + C` drückst, wird die App beendet.

---

### Schritt 2: Im Browser öffnen

Lass das Terminal im Hintergrund laufen, öffne deinen normalen Webbrowser (Chrome, Firefox, Safari, Edge usw.) und gib diese Adresse ein:

👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)** (oder **[http://localhost:5000](http://localhost:5000)**)

Schon siehst du die Sloptip-Oberfläche und kannst das Tool nutzen!

---

## 🔄 Neue Updates herunterladen (Aktualisierung)

Wenn neue Funktionen oder Fehlerbehebungen veröffentlicht werden, kannst du deine Version ganz einfach auf den neuesten Stand bringen:

1. Klicke in das Terminalfenster, in dem die App gerade läuft.
2. Drücke **Strg + C** (oder **Ctrl + C** auf manchen Tastaturen), um den Server zu stoppen.
3. Falls die virtuelle Umgebung noch aktiv ist, kannst du sie optional mit diesem Befehl beenden:
   ```bash
   deactivate
   ```
4. Lade die neuesten Änderungen mit diesem Befehl herunter:
   ```bash
   git pull
   ```
5. Aktiviere die virtuelle Umgebung wieder:
   * **Windows**: `venv\Scripts\activate`
   * **macOS / Linux**: `source venv/bin/activate`
6. Aktualisiere die Pakete (falls neue hinzugekommen sind):
   ```bash
   pip install -r requirements.txt
   ```
7. Starte die App wie gewohnt neu:
   ```bash
   python app.py
   ```

---

## 🛠️ Fehlerbehebung (Troubleshooting)

### Befehl nicht gefunden: "python" oder "python3"
* **Windows**: Du hast wahrscheinlich das Häkchen bei **"Add python.exe to PATH"** während der Installation vergessen. Starte den Python-Installationsassistenten einfach erneut, wähle **Modify** (Ändern), setze das Häkchen ganz unten und schließe die Installation ab. Öffne danach ein **neues** Terminalfenster und versuche es erneut.
* **macOS/Linux**: Verwende `python3` statt `python`.

### Adresse bereits belegt (Address already in use)
Wenn eine Fehlermeldung bezüglich Port 5000 oder "Address already in use" auftaucht, läuft im Hintergrund bereits eine Instanz von Sloptip oder ein anderes Programm blockiert diesen Port.
* Schließe alle anderen offenen Terminalfenster, in denen eventuell noch Reste von Python oder Flask laufen könnten.
* Starte dein Terminal neu und probiere es noch einmal.
