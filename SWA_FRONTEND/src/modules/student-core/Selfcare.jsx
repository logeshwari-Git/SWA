function Selfcare(){

const tips = [
"Drink enough water 💧",
"Take deep breaths 🧘",
"Go for a walk 🌿",
"Talk to someone 💬",
"Sleep well 😴",
"Listen to music 🎧"
]

return(

<div className="content-card">

<h2>🌿 Self Care Tips</h2>

<div className="selfcare-grid">

{tips.map((t,i)=>(
<div key={i} className="selfcare-card">
{t}
</div>
))}

</div>

</div>

)

}

export default Selfcare