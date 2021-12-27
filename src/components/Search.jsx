
import React,{useRef} from 'react'
export default function Search({apply,clear}) {
    const searchref = useRef()
    const onClear=()=>{
        if(searchref.current.value!==undefined && searchref.current.value!==''){
            searchref.current.value=''
            clear()

        }
     
    }
    const onaApply=(r)=>{
        console.log(searchref.current.value)
        if(searchref.current.value){
            apply(searchref.current.value)
        }
 
    }
    return (
        <div>
            
<div className="container input-group mb-3 ">
  <input type="text" className="form-control"  ref={searchref} placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2"/>
  <button className="btn btn-outline-primary" type="button" id="button-addon2" onClick={()=>onaApply()}>Search</button>
  <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={()=>onClear()}>Clear</button>
</div>
        </div>
    )
}
