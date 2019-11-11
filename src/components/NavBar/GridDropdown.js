import React, {useEffect, useState, useRef} from 'react';

const GridDropdown = (props) => {

    const node = useRef();
    const [open, setOpen] = useState(false);

    const handleOutsideClick = e =>{
        console.log('clicked outside');
        if(node.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    }

    useEffect(()=>{
        if(open){
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, [open]);

    return ( 
        <div ref={node}>
            <img
            src="grid.svg"
            alt="Grid Menu"
            className="grid-menu"
            onClick={e=>setOpen(!open)}
          />
          {open && (<p>Hello</p>)}
        </div>
     );
}
 
export default GridDropdown;


{/* <div className="dropdown grid-icon"> */}
          
          
          {/* <div className="dropdown-grid-content hidden dropdown-icons">
            <div>
            <a href="#">
              <img src="favicon.svg" height="50px" width="50px"/>
              <p>Resume Q</p>
              </a>
            </div>
            <div>
            <a href="#">
            <img src="sad.svg" height="50px" width="50px"/>
            <p>Interview Q</p>
            </a>
            </div>
            <div>
            <a href="#">
            <img src="quailr.svg" height="50px" width="50px"/>
            <p>QuailR</p>
            </a>
            </div>
            <div>
            <a href="#">
            <img src="drug.svg" height="50px" width="50px"/>
            <p>Design Q</p>
            </a>
            </div>
          </div>
        </div> */}