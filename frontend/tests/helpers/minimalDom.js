// Minimal DOM host for ReactDOM tests; no simulated React hooks or browser sessions.
export function installDom() {
  class Node {
    constructor(name, type = 1, text = '') {
      this.nodeName = name.toUpperCase(); this.tagName = this.nodeName; this.nodeType = type;
      this.nodeValue = text; this.childNodes = []; this.parentNode = null;
      this.ownerDocument = document; this.namespaceURI = 'http://www.w3.org/1999/xhtml';
      this.attributes = {}; this.style = { setProperty(k,v) { this[k]=v; }, removeProperty(k) { delete this[k]; } };
    }
    appendChild(child) { if(child.parentNode) child.parentNode.removeChild(child); this.childNodes.push(child); child.parentNode=this; return child; }
    removeChild(child) { this.childNodes.splice(this.childNodes.indexOf(child),1); child.parentNode=null; return child; }
    insertBefore(child, before) { if(child.parentNode) child.parentNode.removeChild(child); this.childNodes.splice(this.childNodes.indexOf(before),0,child); child.parentNode=this; return child; }
    setAttribute(k,v) { this.attributes[k]=String(v); }
    removeAttribute(k) { delete this.attributes[k]; }
    addEventListener() {} removeEventListener() {}
    get firstChild() { return this.childNodes[0] || null; }
    get textContent() { return this.nodeType===3 ? this.nodeValue : this.childNodes.map(c=>c.textContent).join(''); }
    set textContent(value) { this.childNodes=[]; if(value!=='')this.appendChild(new Node('#text',3,String(value))); }
    get options() { return this.childNodes.filter(c=>c.tagName==='OPTION'); }
  }
  const document = { nodeType:9, addEventListener() {}, removeEventListener() {}, createElement:name=>new Node(name),
    createElementNS:(_ns,name)=>new Node(name), createTextNode:text=>new Node('#text',3,text) };
  document.documentElement=new Node('html'); document.body=new Node('body'); document.activeElement=document.body;
  const window={ document, HTMLElement:Node, HTMLIFrameElement:class {}, addEventListener() {}, removeEventListener() {} };
  document.defaultView=window; globalThis.window=window; globalThis.document=document;
  globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  return document;
}
