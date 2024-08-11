import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import * as EgovNet from 'api/egovFetch';
import CODE from 'constants/code';
import { getSessionItem, setSessionItem } from 'utils/storage';

const SnsNaverCallback = (props) => {
  const navigate = useNavigate();
  
  //백엔드 호출
  const callBackEnd = () => {
	  // 백엔드로 코드값을 넘겨주는 로직
    let code = new URL(window.location.href).searchParams.get("code");
    let state = new URL(window.location.href).searchParams.get("state");
    console.log("code, state=====>", code, state);
    // 요청이 성공하면
    if(code) {
    	const naverLoginUrl = `/login/naver/callback?code=${code}&state=${state}`;
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-type': 'application/json'
            }
        }
        EgovNet.requestFetch(naverLoginUrl,
            requestOptions,
            (resp) => {
				let resultVO = resp.resultVO;
                let jToken = resp?.jToken || null;
                if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                	setSessionItem('jToken', jToken);
                    //setLoginVO(resultVO);
                    setSessionItem('loginUser', resultVO);
                    props.onChangeLogin(resultVO);
                    navigate(URL.MAIN);
                    // PC와 Mobile 열린메뉴 닫기
                    document.querySelector('.all_menu.WEB').classList.add('closed');
                    document.querySelector('.btnAllMenu').classList.remove('active');
                    document.querySelector('.btnAllMenu').title = '전체메뉴 닫힘';
		            document.querySelector('.all_menu.Mobile').classList.add('closed');
                } else {
					window.location.replace("/");
                }
            })
      }
  }
  useEffect(callBackEnd,[]);

  return (
	<>
      {/* 로그인중이라는 것을 표시할 수 있는 로딩중 화면 */}
      로그인 중...
    </>
  );
};

export default SnsNaverCallback;