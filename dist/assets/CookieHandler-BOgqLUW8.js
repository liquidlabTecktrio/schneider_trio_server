function r(n){const t=`${n}=`,c=decodeURIComponent(document.cookie).split(";");for(let i=0;i<c.length;i++){let e=c[i];for(;e.charAt(0)===" ";)e=e.substring(1);if(e.indexOf(t)===0)return e.substring(t.length,e.length)}return""}function s(n,t){const o=new Date;o.setDate(o.getDate()+7),document.cookie=`${n}=${t}; expires=${o.toUTCString()}; path=/;`}export{r as G,s as S};
