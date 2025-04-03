import React from 'react'
import { connect } from 'react-redux';

function CurrencyDropDown(props) {
    const { HandleClose } = props;
    const HandleCurrency = (Currency) => {
        props.dispatch({
            type: "CHANGE-CURRENCY",
            payload: Currency
        })
    }
    return (
        <div className="dropdown">
            <button className="btn dropdown-toggle border-0" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                {props.Name}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li role='button' onClick={() => { 
                    HandleCurrency({ Multiple: 1, Name: "USD $", Symbol: "$" });
                    HandleClose && HandleClose(); 
                }} className='text-center'>USD $</li>
                <li role='button' onClick={() => { 
                    HandleCurrency({ Multiple: 4100, Name: "KHR ៛", Symbol: "៛" }); 
                    HandleClose && HandleClose(); 
                }} className='text-center'>KHR ៛</li>
            </ul>
        </div>
    )
}

const mapStateToProps = (state) => ({
    Name: state.MoneyReducer.Name,
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyDropDown);