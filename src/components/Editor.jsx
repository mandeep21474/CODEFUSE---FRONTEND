import React, { useEffect, useState, useRef } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { go } from '@codemirror/lang-go';
import { php } from '@codemirror/lang-php';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import axios from 'axios';
import { continuedIndent, StreamLanguage } from '@codemirror/language';
import { clike } from '@codemirror/legacy-modes/mode/clike';
import { toast } from 'react-hot-toast';
import './Editor.css'
import Actions from '../Actions';
import { FaPlay, FaSpinner } from "react-icons/fa"

const Editor = ({ socketref, room_id,ispremiuim,trial }) => {

    const languages = {
        javascript: {
            name: 'JavaScript',
            extension: javascript({ jsx: true }),
            sample: `function greetUser(name) {
    console.log(\`Hello, \${name}!\`);
    return \`Welcome to our application, \${name}.\`;
}

const user = "Developer";
const message = greetUser(user);
console.log(message);`
        },
        css: {
            name: 'CSS',
            extension: css(),
            sample: `/* CSS Styles */
    body {
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
    }
    
    h1 {
        color: #fff;
        text-align: center;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    
    p {
        font-size: 18px;
        line-height: 1.6;
    }
    
    button {
        background: #ff6b6b;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }
    
    button:hover {
        background: #ff5252;
    }`
        },
        Development:{
            name:'Development',
            extension: html(),
            sample: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live HTML Preview</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Start editing HTML code...</p>
    <button onclick="alert('Hello from HTML!')">Click Me</button>
</body>
</html>`
        },
        go: {
            name: 'Go',
            extension: go(),
            sample: `package main

import (
    "bufio"
    "fmt"
    "os"
    "strings"
)

func greetUser(name string) string {
    fmt.Printf("Hello, %s!\\n", name)
    return fmt.Sprintf("Welcome to our application, %s.", name)
}

func main() {
    fmt.Print("Enter your name: ")
    reader := bufio.NewReader(os.Stdin)
    user, _ := reader.ReadString('\\n')
    user = strings.TrimSpace(user)
    message := greetUser(user)
    fmt.Println(message)
}`
        },
        c: {
            name: 'C',
            extension: StreamLanguage.define(clike({name: "text/x-c"})),
            sample: `#include <stdio.h>

int main() {
    char appName[] = "CODEFUSE";
    char version[] = "1.0";
    printf("Welcome to %s v%s\\n", appName, version);
    printf("Hello, Developer!\\n");
    return 0;
}`
        },
        csharp: {
            name: 'C#',
            extension: StreamLanguage.define(clike({name: "text/x-csharp"})),
            sample: `using System;

class Program {
    static void Main(string[] args) {
        string appName = "CODEFUSE";
        string version = "1.0";
        Console.WriteLine($"Welcome to {appName} v{version}");
        Console.WriteLine("Hello, Developer!");
    }
}`
        },
        kotlin: {
            name: 'Kotlin',
            extension: StreamLanguage.define(clike({name: "text/x-kotlin"})),
            sample: `fun main() {
    val appName = "CODEFUSE"
    val version = "1.0"
    println("Welcome to \$appName v\$version")
    println("Hello, Developer!")
}`
        },
        scala: {
            name: 'Scala',
            extension: StreamLanguage.define(clike({name: "text/x-scala"})),
            sample: `// Scala: All code must live in object Main
object Main {
    def main(args: Array[String]): Unit = {
        println("Hello, World!")
    }
} `
        },
        python: {
            name: 'Python',
            extension: python(),
            sample: `def greet_user(name):
    print(f"Hello, {name}!")
    return f"Welcome to our application, {name}."

user = "Developer"
message = greet_user(user)
print(message)`
        },
        java: {
            name: 'Java',
            extension: java(),
            sample: `// Java:Name the class to Main and remove 'public'
class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
        },
        cpp: {
            name: 'C++',
            extension: cpp(),
            sample: `#include <iostream>
#include <string>

class WelcomeApp {
private:
    std::string appName;
    std::string version;
public:
    WelcomeApp(const std::string& name, const std::string& ver)
        : appName(name), version(ver) {}

    void greetUser(const std::string& userName) {
        std::cout << "Welcome to " << appName << " v" << version << std::endl;
        std::cout << "Hello, " << userName << "!" << std::endl;
    }
};

int main() {
    WelcomeApp app("CODEFUSE", "1.0");
    app.greetUser("Developer");
    return 0;
} `
        },
        php: {
            name: 'PHP',
            extension: php(),
            sample: `<?php
class WelcomeApplication {
    private $appName;
    private $version;

    public function __construct($appName, $version) {
        $this->appName = $appName;
        $this->version = $version;
    }

    public function greetUser($userName) {
        echo "Welcome to {$this->appName} v{$this->version}\n";
        echo "Hello, {$userName}!\n";
        return "Greeting sent to {$userName}";
    }

    public function getAppInfo() {
        return [
            'name' => $this->appName,
            'version' => $this->version,
            'description' => 'A modern code editor application'
        ];
    }
}

$app = new WelcomeApplication("CODEFUSE", "1.0");
$result = $app->greetUser("Developer");
print_r($app->getAppInfo());
?>`
        },
        rust: {
            name: 'Rust',
            extension: rust(),
            sample: `// Rust: Return owned values, not &str references
use std::collections::HashMap;

struct WelcomeApp {
    app_name: String,
    version: String,
}

impl WelcomeApp {
    fn new(app_name: String, version: String) -> Self {
        WelcomeApp { app_name, version }
    }

    fn greet_user(&self, user_name: &str) -> String {
        println!("Hello, {}!", user_name);
        format!("Greeting sent to {}", user_name)
    }

    fn get_app_info(&self) -> HashMap<String, String> {
        let mut info = HashMap::new();
        info.insert("name".to_string(), self.app_name.clone());
        info.insert("version".to_string(), self.version.clone());
        info
    }
}

fn main() {
    let app = WelcomeApp::new("CODEFUSE".into(), "1.0".into());
    println!("{}", app.greet_user("Developer"));
    println!("{:?}", app.get_app_info());
}`
        },
        sql: {
            name: 'SQL',
            extension: sql(),
            sample: `-- SQL: Define schema and data before querying
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL
);

INSERT INTO users (username, email) VALUES
('developer1', 'dev1@example.com'),
('coder2', 'coder2@example.com');

-- Now select to see results
SELECT * FROM users; `
        },
    };

    const themes = {
        dark: {
            name: 'GitHub Dark',
            theme: githubDark
        },
        vscode: {
            name: 'VS Code Dark',
            theme: vscodeDark
        },
        onedark: {
            name: 'One Dark',
            theme: oneDark
        }
    };

    // State management
    const [ide_lang, setide_lang] = useState(javascript({ jsx: true }));
    const [code_value, setcode_value] = useState(languages.javascript.sample);
    const [selected_theme, setselected_theme] = useState(githubDark);
    const [current_lang, setcurrent_lang] = useState('javascript');
    const [executing, setexecuting] = useState(false);
    const [input, setinput] = useState("");
    const [output, setoutput] = useState("");
    const [outputType, setOutputType] = useState(""); // success, error, or ""

    const [isdevmode, setIsdevmode] = useState(false);
    const [htmlCode, setHtmlCode] = useState(languages.Development.sample);
    const [htmleditor, sethtmleditor] = useState(false);
    const [csseditor, setcsseditor] = useState(false);
    const [jseditor, setjseditor] = useState(false);
    const htmlref = useRef(null)
    const [cssCode, setCssCode] = useState(languages.css.sample);
    const cssref = useRef(null)
    const [jsCode, setJsCode] = useState(languages.javascript.sample);
    const jsref = useRef(null)
    const iframeRef = useRef(null);

    const isRemoteChange = useRef(false);
    const lastRemoteCode = useRef('');

    // Language selection handler
    const handle_lang = (e) => {
        const lang = e.target.value;
        setcurrent_lang(lang);
        if(lang === 'Development'){
            setIsdevmode(true);
            setide_lang(languages[lang].extension);
            setHtmlCode(languages.Development.sample);
            setCssCode(languages.css.sample);
            setJsCode(languages.javascript.sample);
        }
        else{
            sethtmleditor(false);
            setcsseditor(false);
            setjseditor(false);
            setIsdevmode(false);
            setide_lang(languages[lang].extension);
            setcode_value(languages[lang].sample);
        }

        // Emit language change to other clients

        if(lang === 'Development'){
            if (socketref.current) {
                socketref.current.emit(Actions.CODE_CHANGE, {
                    room_id,
                    htmlCode: languages.Development.sample,
                    cssCode: languages.css.sample,
                    jsCode: languages.javascript.sample,
                    language: lang,
                });
            }

        }
        else{
            if (socketref.current) {
                socketref.current.emit(Actions.CODE_CHANGE, {
                    room_id,
                    code: languages[lang].sample,
                    language: lang,
                });
            }
        }


    };

    // Theme selection handler
    const handle_theme = (e) => {
        const theme = e.target.value;
        setselected_theme(themes[theme].theme);
    };

    // Handle code changes from the editor
    const handle_code_change = (value, viewUpdate) => {
        if (!isRemoteChange.current) {
            setcode_value(value);
            // Emit the change to other clients immediately
            if (socketref.current) {
                socketref.current.emit(Actions.CODE_CHANGE, {
                    room_id,
                    code: value,
                    language: current_lang
                });
            }
        }
    };



    //handle html code change
    const handle_htmlcode_change = (value, viewUpdate) => {
        if (!isRemoteChange.current) {
            setHtmlCode(value);
            // Emit the change to other clients immediately
            if (socketref.current) {
                socketref.current.emit(Actions.CODE_CHANGE, {
                    room_id,
                    htmlCode: value,
                    language: current_lang,
              
                });
            }
        }
    };

    //handle css code change
    const handle_csscode_change = (value, viewUpdate) => {
        if (!isRemoteChange.current) {
            setCssCode(value);
            // Emit the change to other clients immediately
            if (socketref.current) {
                socketref.current.emit(Actions.CODE_CHANGE, {
                    room_id,
                    cssCode: value,
                    language: current_lang,
              
                });
            }
        }
    };

    //handle js code change
    const handle_jscode_change = (value, viewUpdate) => {
        if (!isRemoteChange.current) {
            setJsCode(value);
            // Emit the change to other clients immediately
            if (socketref.current) {
                socketref.current.emit(Actions.CODE_CHANGE, {
                    room_id,
                    jsCode: value,
                    language: current_lang,
              
                });
            }
        }
    };


    //to show live changes

    useEffect(() => {

        if(isdevmode&&iframeRef.current){
            const iframe = iframeRef.current;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            let finalHTML = htmlCode;
            finalHTML = finalHTML.replace("</body>",`<style>${cssCode}</style></body>`);
            finalHTML = finalHTML.replace("</body>",`<script>${jsCode}</script></body>`);
            
            try{
            iframeDoc.open();
            iframeDoc.write(finalHTML);
            iframeDoc.close();
        }
        catch(error){
            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Preview Error</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; color: #d73a49; background: #ffeef0; }
                        .error-box { border: 1px solid #d73a49; padding: 15px; border-radius: 4px; background: white; }
                    </style>
                </head>
                <body>
                    <div class="error-box">
                        <h3>🚨 Preview Render Error</h3>
                        <p>Could not render the live preview. Please check your HTML syntax.</p>
                        <pre>${error.message}</pre>
                    </div>
                </body>
                </html>
            `);
            iframe.close();
        }
        }
    }, [htmlCode,cssCode,jsCode,isdevmode]);
    
    // Handle remote code changes via Socket.IO
    useEffect(() => {
        if (socketref.current) {
            const handleCodeChange = (data) => {

                // console.log("other users got this:- ",data.htmlCode);
                // console.log("other users curreent dev settings:-",htmlCode,cssCode,jsCode)

                if(data.language === 'Development'){

                // Only update if the code is different from current value
                if ((data.htmlCode!==undefined && data.htmlCode !== htmlCode) || data.language !== current_lang||(data.cssCode!==undefined && data.cssCode !== cssCode)||(data.jsCode!==undefined &&data.jsCode !== jsCode)) {
                    isRemoteChange.current = true;
                    // lastRemoteCode.current = data.code;
                    // Update the editor state
                   
                        setIsdevmode(true);
                        // sethtmleditor(true);
                      
               
                    if(data.htmlCode!==undefined){
                        setHtmlCode(data.htmlCode);
                    }
                    if(data.cssCode!==undefined){
                        setCssCode(data.cssCode);
                    }
                    if(data.jsCode!==undefined){
                        setJsCode(data.jsCode);
                    }
                    setide_lang(languages[data.language]?.extension || javascript({ jsx: true }));
                    setcurrent_lang(data.language);
                    // Reset the flag after state update
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            isRemoteChange.current = false;
                        });
                    });
                }
                    
                }


                else{



                    // Only update if the code is different from current value
                    if ((data.code !== code_value || data.language !== current_lang)) {
                        isRemoteChange.current = true;

                       
                            setIsdevmode(false);
                            sethtmleditor(false);
                            setcsseditor(false);
                            setjseditor(false);
                        
    
                        setcode_value(data.code);
                        setide_lang(languages[data.language]?.extension || javascript({ jsx: true }));
                        setcurrent_lang(data.language);
                        // Reset the flag after state update
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                isRemoteChange.current = false;
                            });
                        });
                    }
                }
            };

            socketref.current.on(Actions.CODE_CHANGE, handleCodeChange);

            // Cleanup function
            return () => {
                if (socketref.current) {
                    socketref.current.off(Actions.CODE_CHANGE, handleCodeChange);
                }
            };
        }
    }, [socketref.current, code_value, current_lang,htmlCode,cssCode,jsCode]);

    useEffect(() => {
        if (socketref.current) {
            socketref.current.on(Actions.SYNC_CODE, (data) => {
                if(data.language === 'Development'){

                    isRemoteChange.current = true;
            
                
                    setIsdevmode(true);
                 
                    setHtmlCode(data.htmlCode);
                    setCssCode(data.cssCode);
                    setJsCode(data.jsCode);
                    setide_lang(languages[data.language]?.extension || javascript({ jsx: true }));
                    setcurrent_lang(data.language);
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            isRemoteChange.current = false;
                        });
                    });




                }



                else{
                
                    isRemoteChange.current = true;
                
          
                    
                        setIsdevmode(false);
                        sethtmleditor(false);
                        setcsseditor(false);
                        setjseditor(false);
                    
                  
                    setcode_value(data.code);
                    setide_lang(languages[data.language]?.extension || javascript({ jsx: true }));
                    setcurrent_lang(data.language);
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            isRemoteChange.current = false;
                        });
                    });
            }
            })
        


            return () => {
                if (socketref.current) {
                    socketref.current.off(Actions.SYNC_CODE);
                }
            }
        }
    }, [socketref.current, code_value, current_lang,htmlCode,cssCode,jsCode])

    // Listening for output
    useEffect(() => {
        if (socketref.current) {
            socketref.current.on(Actions.EXECUTE_CODE, ({ output, status, executionTime, memory }) => {
                if (status === 'Accepted') {
                    setoutput(output);
                    setOutputType("success");
                } else {
                    setoutput(status);
                    setOutputType("error");
                }
            })

            return () => {
                if (socketref.current) {
                    socketref.current.off(Actions.EXECUTE_CODE);
                }
            }
        }
    }, [socketref.current])

    const handle_execute = async () => {
        setexecuting(true);
        setoutput("");
        setOutputType("");

        try {
            const request_execution = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/execute`, {
                input: input,
                room_id,
                code: code_value,
                language: current_lang
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            setexecuting(false);

            if (request_execution.data.message === 'Already executing for this room') {
                toast.error("Code execution already in progress for this room", {
                    duration: 4000,
                    position: 'top-right',
                    style: {
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 26, 0.95))',
                        backdropFilter: 'blur(20px)',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 107, 107, 0.3)',
                    },
                    iconTheme: {
                        primary: '#ff6b6b',
                        secondary: '#000000',
                    },
                });
                return;
            } else if (request_execution.data.status === 'Accepted') {
                setoutput(request_execution.data.output);
                setOutputType("success");
                toast.success("Code executed successfully", {
                    duration: 2000,
                    position: 'top-right',
                    style: {
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(26, 26, 26, 0.95))',
                        backdropFilter: 'blur(20px)',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '16px',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                    },
                    iconTheme: {
                        primary: '#00ff88',
                        secondary: '#000000',
                    },
                });
            } else {
                setoutput(request_execution.data.status);
                setOutputType("error");
                toast.error("Code execution failed", {
                    duration: 3000,
                    position: 'top-right',
                });
            }

            if (socketref.current) {
                socketref.current.emit(Actions.EXECUTE_CODE, {
                    room_id,
                    output: request_execution.data.output,
                    status: request_execution.data.status,
                    executionTime: request_execution.data.executionTime,
                    memory: request_execution.data.memory
                })
            }
        } catch (error) {
            console.error("Error during code execution:", error);
            setexecuting(false);
            setoutput("Error: Failed to execute code. Please try again.");
            setOutputType("error");
            toast.error("Execution failed. Please try again.", {
                duration: 3000,
                position: 'top-right',
            });
        }
    };

    const handle_input_change = (details) => {
        setinput(details.target.value);
    };

    useEffect(() => {
        if (isdevmode && !htmleditor && !csseditor && !jseditor) {
            
            handle_html();
        }
    }, [isdevmode]);
    const handle_html = () => {
        sethtmleditor(true);
        setcsseditor(false);
        setjseditor(false);
        if(cssref.current){
            cssref.current.classList.remove('code-tab-active')
        }
        if(jsref.current){
            jsref.current.classList.remove('code-tab-active')
        }
        if(htmlref.current){
            htmlref.current.classList.add('code-tab-active')
        }

    
    };
    const handle_css = () => {
        sethtmleditor(false);
        setcsseditor(true);
        setjseditor(false);
        if(htmlref.current){
            htmlref.current.classList.remove('code-tab-active')
        }
        if(jsref.current){
            jsref.current.classList.remove('code-tab-active')
        }
        if(cssref.current){
            cssref.current.classList.add('code-tab-active')
        }
    
    };
    const handle_js = () => {
        sethtmleditor(false);
        setcsseditor(false);
        setjseditor(true);
        if(htmlref.current){
            htmlref.current.classList.remove('code-tab-active')
        }
        if(cssref.current){
            cssref.current.classList.remove('code-tab-active')
        }
        if(jsref.current){
            jsref.current.classList.add('code-tab-active')
        }
    
    };
    return (
        <div className='editor-component'>
            {/* Control Panel */}
            <div className='editor-controls'>
                <div className='control-section'>
                    <div className='control-group'>
                        <label className='labels'>Language:</label>
                        <select 
                            className='lang_selector' 
                            value={current_lang} 
                            onChange={handle_lang}
                        >
                            {Object.keys(languages).map((val, ind) => {
                        return val === 'css' ? null : (
                            <option key={ind} value={val}>
                                {languages[val].name}
                            </option>
                        )
                    })}

                        </select>
                    </div>

                    <div className='control-group'>
                        <label className='labels'>Theme:</label>
                        <select 
                            className='theme_selector' 
                            value={Object.keys(themes).find(key => themes[key].theme === selected_theme)} 
                            onChange={handle_theme}
                        >
                            {Object.keys(themes).map((val, ind) => {
                                return (
                                    <option key={ind} value={val}>
                                        {themes[val].name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                </div>

                {(ispremiuim||trial===true)&&(<div className='execute_code'>
                    {!isdevmode &&(<button 
                        onClick={handle_execute}
                        disabled={executing}
                        aria-label="Execute code"
                    >
                        {executing ? (
                            <FaSpinner className="spinner" />
                        ) : (
                            <FaPlay className="play_button" />
                        )}
                        {executing ? "Running..." : "Run Code"}
                    </button>)
                    }
                </div>)}
            </div>



            {/* tabs for css and js for dev mode */}
            {
                isdevmode && (
                    <div className='code-tabs'>
                        <button ref={htmlref} className='code-tab' onClick={handle_html}>HTML</button>
                        <button ref={cssref} className='code-tab' onClick={handle_css}>CSS</button>
                        <button ref={jsref} className='code-tab' onClick={handle_js}>JS</button>
                        
                    </div>


                )
            }
            {/* Code Editor */}

            {/* {  codemirror for dev mode } */}

            {

                //html
                isdevmode && (
                    <div className='code-editor-container'>
                    <div className='code-mirror'>
                        {
                            htmleditor && (
                                <CodeMirror
                            value={htmlCode}  /// 
                            theme={selected_theme}
                            extensions={[ide_lang]}
                            onChange={handle_htmlcode_change}
    
                            basicSetup={{
                                lineNumbers: true,
                                foldGutter: true,
                                dropCursor: false,
                                allowMultipleSelections: false,
                                indentOnInput: true,
                                bracketMatching: true,
                                closeBrackets: true,
                                autocompletion: true,
                                highlightSelectionMatches: false
                            }}
                        />
                            )
                        }

                        
                        {
                            //css
                            csseditor && (
                                <CodeMirror
                            value={cssCode}
                            theme={selected_theme}
                            extensions={css()}
                            onChange={handle_csscode_change}
    
                            basicSetup={{
                                lineNumbers: true,
                                foldGutter: true,
                                dropCursor: false,
                                allowMultipleSelections: false,
                                indentOnInput: true,
                                bracketMatching: true,
                                closeBrackets: true,
                                autocompletion: true,
                                highlightSelectionMatches: false
                            }}
                        />
                            )
                        }
                        {
                            jseditor && (
                                <CodeMirror
                            value={jsCode}
                            theme={selected_theme}
                            extensions={javascript({ jsx: true })}
                            onChange={handle_jscode_change}
    
                            basicSetup={{
                                lineNumbers: true,
                                foldGutter: true,
                                dropCursor: false,
                                allowMultipleSelections: false,
                                indentOnInput: true,
                                bracketMatching: true,
                                closeBrackets: true,
                                autocompletion: true,
                                highlightSelectionMatches: false
                            }}
                        />
                            )
                        }
                    </div>


                    {/* Live Preview Section */}

                    {(ispremiuim||trial===true)&&(<div className='live-preview-container'>
                        <h5 className='live-preview-title'>Live Preview</h5>
                        <div className='live-preview'>
                            <iframe ref={iframeRef}
                                title="Live Preview"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '4px'
                                }}/>
                            
                        </div>

                    </div>)}
                    </div>
                )
            }
                {
                    !isdevmode&&(
                        <div className='code-editor-container'>
                <div className={ispremiuim?"code-mirror":"code-mirror-non-premium"}>
                    <CodeMirror
                        value={code_value}
                        theme={selected_theme}
                        extensions={[ide_lang]}
                        onChange={handle_code_change}

                        basicSetup={{
                            lineNumbers: true,
                            foldGutter: true,
                            dropCursor: false,
                            allowMultipleSelections: false,
                            indentOnInput: true,
                            bracketMatching: true,
                            closeBrackets: true,
                            autocompletion: true,
                            highlightSelectionMatches: false
                        }}
                    />
                </div>

                {/* Input/Output Section */}
                {(ispremiuim||trial===true)&&(<div className='in_out_container'>
                    <div className='input'>
                        <h5>📝 Input</h5>
                        <textarea
                            value={input}
                            onChange={handle_input_change}
                            placeholder="Enter input for your program..."
                            disabled={executing}
                        />
                    </div>

                    <div className='output'>
                        <h5>📤 Output</h5>
                        <textarea 
                            value={output}
                            readOnly
                            className={outputType}
                            placeholder={executing ? "Executing..." : "Output will appear here..."}
                        />
                       
                    </div>
                </div>)}
            </div>

                    )
                }

            
        </div>
    )
}

export default Editor 
