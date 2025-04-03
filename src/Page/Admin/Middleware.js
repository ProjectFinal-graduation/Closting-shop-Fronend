import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Cookies from "js-cookie";
import { connect } from 'react-redux';
import { PING } from '../../Config/Admin';
import httpClient from '../../Utils/request';

function Middleware(props) {
  const navigation = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!location.pathname.includes("/admin/login") && !Cookies.get("userToken")) {
      navigation('/admin/login', {
        state: {
          pathname: location.pathname
        }
      });
    } else {
      if (Cookies.get("userToken")) {
        httpClient.post(PING)
          .then((res) => {
            if (res.status === 200) {
              props.dispatch({
                type: "SET-TOKEN",
                payload: {
                  Token: Cookies.get("userToken"),
                  Role: res.data.role
                }
              });
            } else {
              Cookies.remove("userToken");
              navigation('/admin/login', {
                state: {
                  pathname: location.pathname
                }
              });
            }
          }).catch((err) => {
            console.log(err);
          });
      }
    }
  }, [location])
  return (
    <div>
      <Outlet />
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({ dispatch })

const mapStateToProps = (state) => ({
  Token: state.TokenReducer.Token,
  Role: state.TokenReducer.Role
})

export default connect(mapStateToProps, mapDispatchToProps)(Middleware);