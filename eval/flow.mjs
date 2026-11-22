import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const B = createRequire(import.meta.url)('../speech.js');
const saved = new Map();
function boot(storage=saved) {
 const nodes = new Map();
 const node = id => { if(!nodes.has(id)) nodes.set(id,{textContent:'',value:'',style:{},hidden:false,classList:{add(){},remove(){},toggle(){}},setAttribute(){},append(){},replaceChildren(){},focus(){},scrollIntoView(){},showModal(){this.open=true;},close(){this.open=false;}}); return nodes.get(id); };
 const context = vm.createContext({window:{BolKar:B,isSecureContext:false},document:{getElementById:node,createElement:()=>node(Symbol())},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},console,setTimeout,Blob,URL});
 vm.runInContext(fs.readFileSync(new URL('../app.js',import.meta.url),'utf8'),context);
 return {node,run:s=>vm.runInContext(s,context),state:()=>JSON.parse(storage.get('bolkar_form_v2'))};
}
let app=boot();
assert.equal(app.node('tour').open,true);
for(let i=0;i<5;i++) app.node('next').onclick();
assert.equal(app.node('tour').open,false);
app.node('how').onclick(); app.node('skip').onclick();
app.node('example').onclick();
assert.equal(app.state().pending.value,150000);
app=boot(); assert.equal(app.node('tour').open,undefined); assert.equal(app.state().pending.value,150000);
app.node('confirm').onclick(); assert.equal(app.state().i,6); assert.equal(app.state().saved,false);
app.node('save').onclick(); assert.equal(app.state().saved,true);
app.node('reset').onclick(); app.node('cancelReset').onclick(); assert.equal(app.state().saved,true);
app.node('reset').onclick(); app.node('doReset').onclick(); assert.equal(Object.keys(app.state().values).length,0);
for(const value of ['Sunita Devi','5 March 2005','Female','9876543210','282001','12000 per month']) {
 app.node('typed').value=value; app.node('answerForm').onsubmit({preventDefault(){}});
 assert.ok(app.state().pending,value);
 app=boot(); assert.ok(app.state().pending,value+' restores');
 app.node('confirm').onclick();
}
assert.equal(app.state().i,6); assert.equal(app.state().values.income,144000);
app.run('state.i=3; state.pending=null; render()');
app.node('typed').value='123'; app.node('answerForm').onsubmit({preventDefault(){}}); assert.equal(app.state().pending,null); assert.match(app.node('feedback').textContent,/10/);
app.node('typed').value='9988812345';app.node('typed').oninput();app=boot();assert.equal(app.node('typed').value,'9988812345');
app.node('answerForm').onsubmit({preventDefault(){}});app.node('language').value='hi';app.node('language').onchange();assert.equal(app.state().pending.value,'9988812345');
app.node('change').onclick();assert.equal(app.state().pending,null);
const unavailable={get(){throw Error('blocked');},set(){throw Error('blocked');},delete(){throw Error('blocked');}};
app=boot(unavailable);assert.match(app.node('storage').textContent,/unavailable/);
console.log('Controller flow passed: tour, example, confirm, save, reset, typing, validation, refresh, language and unavailable storage.');
