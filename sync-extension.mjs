import {copyFileSync,mkdirSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
mkdirSync('extension/core',{recursive:true});
for(const name of readdirSync('core'))if(name.endsWith('.js'))copyFileSync('core/'+name,'extension/core/'+name);
for(const [src,dst] of [['speech.js','speech.js'],['app.js','sidepanel.js'],['base.css','base.css']])copyFileSync(src,'extension/'+dst);
let html=readFileSync('index.html','utf8').replace('href="base.css"','href="base.css"><link rel="stylesheet" href="sidepanel.css"').replace('src="app.js"','src="sidepanel.js"').replace('<a href="research.html">Research</a>','').replace('<h1>Your language.<br>Your form.<br><em>Less effort.</em></h1>','<h1>Your language.<br>Your form.</h1>').replace('<main>','<main><details class="proxy-settings"><summary>Voice service settings</summary><label for="proxyUrl">Your deployed BolKar website address</label><input id="proxyUrl" type="url" placeholder="https://your-site.pages.dev"><button id="saveProxy">Save address</button><p class="small">No API key goes here. Your site’s server holds the key.</p></details>');
writeFileSync('extension/sidepanel.html',html);
writeFileSync('extension/content-generic.js',readFileSync('extension/content-google-forms.js','utf8').replace('extract(document,true)','extract(document,false)'));
console.log('Extension shared modules synchronised.');
