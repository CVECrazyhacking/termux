// Here is an object with all the commands. Try adding your own, it's very simple!

const commands = {
  fallback: () => error("Unknown command: '" + getCmd().cmd + "'. To get a list of all commands type 'help'"),
  help: {
    description: "Get a list of all available commands. Also provides information for a given command.",
    args: ['[command]'],
    aliases: ['?'],
    function: help
  },
  list: {
    description: "Get a list of all available commands.",
    aliases: ['cmds', 'li'],
    function: () => msg(Object.keys(commands).slice(1, Object.keys(commands).length).join(', '))
  },
  user: {
    description: "Change username and path. Default: 'user root'",
    args: ['[username] [path]'],
    aliases: ['username', 'un'],
    function: () => {
      username = getCmd().args[0] || 'user';
      path = getCmd().args[1] || 'root';
      updatePre();
    }
  },
  pointer: {
    description: "Change terminal pointer icon. Must be of length: '1'. Default: '>'",
    args: ['[symbol]'],
    example: '~',
    aliases: ['suffix', 'point'],
    function: () => {
      if (checkArgs()) {
        if (getCmd().args[0].length === 1) {
          suffix = getCmd().args[0];
          updatePre();
        } else error("Input was of length '" + getCmd().args[0].length + "'. Must be of length: '1'.");
      }
    }
  },
  echo: {
    description: "Makes the terminal speak",
    args: ['[msg]'],
    aliases: ['e', 'speak', 'talk', 'msg', 'message'],
    function: () => msg(getCmd().args.join(' '))
  },
  version: {
    description: "Get terminal version",
    aliases: ['v', 'about'],
    function: () => msg('Terminal v' + version)
  },
  ls: {
    description: "Get terminal version",
    aliases: ['v', 'about'],
    function: () => msg('Muestra lo que hay dentro de la carpeta:' + ' carpeta1 imagen.png termux')
  },
  cd: {
    description: "Get terminal version",
    aliases: ['v', 'about'],
    function: () => msg('Nos lleva a home:' + ' Termux@home')
  },
  cd_termux: {
    description: "Get terminal version",
    aliases: ['v', 'about'],
    function: () => msg('Entra a dicho archivo:' + ' Termux@home/termux')
  },
  exit: {
    description: "Get terminal version",
    aliases: ['v', 'about'],
    function: () => msg('Sale de la terminal:' )
  },
  apt_update: {
    description: "Get terminal version",
    aliases: ['v', 'about'],
    function: () => msg('apt update: Actualiza la lista de paquetes disponibles Estos comandos deben ejecutarse inicialmente directamente después de la instalación y regularmente después para recibir actualizaciones' )
  },
  apt_upgrade: {
    description: "Get terminal version",
    aliases: ['v', 'about'],
    function: () => msg('apt upgrade: Actualiza paquetes obsoletos. Para que Apt pueda conocer los paquetes más nuevos, deberá actualizar el índice del paquete, por lo que normalmente querrá ejecutar apt update antes de actualizar.' )
  },
  apt_install: {
    description: "Get terminal version",
    aliases: ['v', 'about'],
    function: () => msg('apt install "nombre del paquete": instala un paquete nuevo' )
  },
  clear: {
    description: "Clears the terminal",
    aliases: ['cl', 'clr', 'reset', 'wipe'],
    function: () => terminal.querySelector('.output').innerHTML = ''
  },
  clearhistory: {
    description: "Clears the history",
    aliases: ['clh', 'clrh', 'historyclear'],
    function: () => {cmdHistory = {values: [], index: 0, current: ''}}
  },
  history: {
    description: "Get a list of used commands",
    aliases: ['log', 'cmds'],
    function: () => {
      if (cmdHistory.values.length > 1) {
        cmdHistory.values.forEach((val, i) => {
          if (i < cmdHistory.values.length - 1) msg((i + 1) + ' - ' + val);
        });
      } else msg('No history');
    }
  },
  color: {
    description: "Change text and background color",
    args: ['{background_color}{color}', 'list'],
    aliases: ['colour', 'brush'],
    function: color
  },
  whoami: {
    description: "Get user info",
    aliases: ['browser', 'info', 'me'],
    function: whoami
  },
  date: {
    description: "Get current date and time",
    aliases: ['time', 'today'],
    function: () => msg(Date())
  },
  uuid: {
    description: "Generate a random UUID",
    aliases: ['guid', 'uid', 'id', 'unique'],
    function: uuid
  },
  ip: {
    description: "Generate a random ip address",
    aliases: ['address'],
    function: () => msg(new Array(4).fill(0).map(() => Math.floor(Math.random() * 255) + 1).join('.'))
  },
  math: {
    description: "Calculate with the computer",
    args: ['{expression}'],
    example: '191*7',
    aliases: ['calc', 'meth'],
    function: () => {
      if (checkArgs()) msg(eval(getCmd().args.join('')))
    }
  }
}

var username = 'Termux';
var prefix = '@';
var path = 'root';
var suffix = '>';
var version = '1.0';


// helper functions

const getUser = () => username + prefix + path + '<span class="suffix">' + suffix + '</span>';
const getCmd = () => {
  return {cmd: input.value.split(' ')[0].toLowerCase(), args: input.value.split(' ').slice(1, input.value.split(' ').length).filter(a => a)}
};
const getCmdByAlias = cmd => {
  if (!commands[cmd]) {
    Object.entries(commands).forEach(entry => {
      if (entry[1].aliases) {
        entry[1].aliases.forEach(a => {
          if (cmd === a) cmd = entry[0];
        })
      }
    });
  }
  return cmd;
}
const checkArgs = (amount = 1) => {
  let hasArgs = true;
  if (getCmd().args.length < amount) {
    hasArgs = false;
    let cmdObj = commands[getCmdByAlias(getCmd().cmd)];
    error('Missing arguments: ' + cmdObj.args.join(', '));
    if (cmdObj.example) msg('Usage: ' + getCmd().cmd + ' ' + cmdObj.example);
  }
  return hasArgs;
}
const updatePre = () => {
  let user = getUser();
  terminal.querySelectorAll('.pre').forEach(pre => pre.innerHTML = user);
}

const msg = message => {
  var text = document.createElement('span');
  text.innerText = message;
  text.classList.add('text');
  terminal.querySelector('.output').appendChild(text);
}
const error = message => msg('Error! ' + message);


// initialize

var terminal = document.querySelector('.terminal');
var input = terminal.querySelector('.input');
var cmdHistory = {values: [], index: 0, current: ''};
terminal.querySelector('.typeArea').querySelector('.pre').innerHTML = getUser();
input.focus();

function newLine() {
  var line = document.createElement('div');
  var pre = document.createElement('span');
  var text = document.createElement('span');
  pre.classList.add('pre');
  text.classList.add('input');
  pre.innerHTML = getUser();
  text.innerText = input.value;
  line.appendChild(pre);
  line.appendChild(text);
  terminal.querySelector('.output').appendChild(line);
  
  // scroll to bottom
  setTimeout(() => terminal.scrollTo(0, Math.max(0, input.offsetTop + input.offsetHeight - window.innerHeight)), 100);
  
  // history
  if (input.value.length) cmdHistory.values.push(input.value);
  cmdHistory.index = cmdHistory.values.length;
  cmdHistory.current = '';
}

// listeners

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    newLine();
    
    // get commands
    var cmd = getCmdByAlias(getCmd().cmd);
    if (commands[cmd]) {
      commands[cmd].function()
    } else if (cmd !== '') commands.fallback();
    input.value = '';
    
  } else if (e.key === 'ArrowUp') { // history back
    if (cmdHistory.index === cmdHistory.values.length) cmdHistory.current = input.value;
    let newIndex = cmdHistory.index - 1;
    if (newIndex >= 0) {
      cmdHistory.index = newIndex;
      input.value = cmdHistory.values[newIndex];
    }
  } else if (e.key === 'ArrowDown') { // history forward
    let newIndex = cmdHistory.index + 1;
    if (newIndex <= cmdHistory.values.length) {
      cmdHistory.index = newIndex;
      let newVal = cmdHistory.values[newIndex];
      if (newIndex === cmdHistory.values.length) newVal = cmdHistory.current;
      input.value = newVal;
    }
  }
});

terminal.addEventListener('click', () => input.focus());


// command functions

function help() {
  console.log(getCmd());
  let cmdInfo = commands[getCmdByAlias(getCmd().args[0])];
  if (getCmd().args.length && cmdInfo) {
    msg(cmdInfo.description || 'No desciption');
    if (cmdInfo.args?.length) {
      msg('Usage:');
      cmdInfo.args.forEach(string => {
        msg(getCmdByAlias(getCmd().args[0]) + ' ' + string);
      })
    }
    msg('Aliases: ' + (cmdInfo.aliases?.join(', ') || 'No aliases'));
  } else msg(Object.keys(commands).slice(1, Object.keys(commands).length).join(', '));
}

function uuid() {
  // Source: https://stackoverflow.com/a/2117523
  msg(([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)));
}

function whoami() {
  msg('Browser name: ' + navigator.appName);
  msg('Version info: ' + navigator.appVersion);
  msg('Cookies enabled: ' + navigator.cookieEnabled);
  msg('Language: ' + navigator.language);
  msg('Online: ' + navigator.onLine);
  msg('Platform: ' + navigator.platform);
  msg('Browser engine: ' + navigator.product);
  msg('User-agent header: ' + navigator.userAgent);
}

function color() {
  const colorList = {0: 'Black', 1: 'Blue', 2: 'Green', 3: 'DodgerBlue', 4: 'Red', 5: 'DarkMagenta', 6: 'Orange', 7: 'Gray', 8: 'DimGray', 9: 'RoyalBlue', 'a': 'Lime', 'b': 'DarkTurquoise', 'c': 'IndianRed', 'd': 'Magenta', 'e': 'PaleGoldenRod', 'f': 'White'};
  
  if (!getCmd().args.length) {
    document.documentElement.style.setProperty('--background', null);
    document.documentElement.style.setProperty('--color', null);
  } else if (getCmd().args[0].length === 2) {
    let bg = getCmd().args[0][0].toLowerCase();
    let cl = getCmd().args[0][1].toLowerCase();
    document.documentElement.style.setProperty('--background', colorList[bg]);
    document.documentElement.style.setProperty('--color', colorList[cl]);
    console.log(bg, colorList[bg])
  } else if (getCmd().args[0] === 'list') {
    msg("Colors:");
    Object.entries(colorList).forEach(entry =>  msg(entry.join(' - ')));
  } else {
    error("Argument should be of this format: [{background_color}{color}].");
    msg("Type 'color list' to get a list of all the colors.");
    msg("Usage: color 0e");
  }
}

// TODOs:
// custom cursor _
// move cursor to end history
// enable auto focus
// tab autocomplete / Did you mean?
// Commands:
// tree?, ping (can't because of https), hack/admin (fake hack), ++
// sleep X?, test: q? [y/n]
