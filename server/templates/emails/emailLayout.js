const emailLayout = (title, body) => {

return `

<div style="
max-width:700px;
margin:auto;
background:#ffffff;
border-radius:18px;
overflow:hidden;
font-family:Arial,sans-serif;
box-shadow:0 5px 20px rgba(0,0,0,0.12);
">

<div style="
background:linear-gradient(135deg,#2563eb,#1e3a8a);
padding:30px;
text-align:center;
">

<img
src="https://res.cloudinary.com/dsjfgmkwh/image/upload/f_auto/logo_bjbyk4"
width="220"
/>

</div>

<div style="padding:35px;">

${title}

${body}

</div>

<hr>

<div style="
padding:20px;
text-align:center;
font-size:13px;
color:#6b7280;
">

🚗 Brezzy Drive

<br>

Drive Smart • Rent Easy

</div>

</div>

`

}

export default emailLayout