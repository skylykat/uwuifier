const { Plugin } = require('powercord/entities');
const { getModule, React } = require('powercord/webpack');
const { inject, uninject} = require('powercord/injector');

let owoifierAutoToggle = false;

module.exports = class Owoify extends Plugin { 
  async startPlugin () {

    function owoifyText(v) {
      var words = v.split(' ');
      var output = '';

      for (let index = 0; index < words.length; index++) {
        const element = words[index];
        if (!element.startsWith('<@') && !element.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
          // copyright owo dimden uwu uwu 2020
          let d = {"l":"w", "i":"wi", "ea":"ew", "ou":"ow", "ha":"a", "u":"uw", "ee":"eew", "mp":"wp", "mm":"mya", "an":"nya", "on":"nyon", "r":"w", "g":"gy"};
          let format_string = element
          for(let i in d) {
            format_string = format_string.replace(new RegExp(i, "g"), d[i]);
          };
          // thanks dimden ur epic
          output += format_string + ' '
        } else {
          output += element + ' '
        }
      }

      return output
    }

    const messageEvents = await getModule(["sendMessage"]);
    inject("owoifierSend", messageEvents, "sendMessage", function(args) {
      if(owoifierAutoToggle) {
        let text = args[1].content;
        text = owoifyText(text);
        args[1].content = text;      
      }      
      return args;  
    }, true);

    powercord.api.commands.registerCommand({
      command: 'uwu',
      description: `uwuify all of your messages`,
      executor: this.toggleAuto.bind(this)
    });    
  }
  
  pluginWillUnload() {
    uninject("owoifierSend"); 
    powercord.api.commands.unregisterCommand('uwu');    
  }

  toggleAuto () {
    owoifierAutoToggle = !owoifierAutoToggle;
    powercord.api.notices.sendToast('owoifyNotif', {
      header: `uwuify`,
      content: `${(owoifierAutoToggle == true) ? 'Its weady to go >w<' : 'Its turned off.'}`,
      timeout: 5e3,
      buttons: [{
        text: 'Dismiss',
        color: 'red',
        look: 'outlined',
        onClick: () => powercord.api.notices.closeToast('owoifyNotif')
      }]      
    });
  }
};
