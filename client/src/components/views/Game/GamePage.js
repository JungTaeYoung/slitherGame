
import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { Card, Icon, Avatar, Col, Typography, Row } from "antd";
import Axios from "axios";
import $ from "jquery";
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';
import moment from "moment"
import './Game.css';

const { Title } = Typography;
const { Meta } = Card;

function GamePage() {
    useEffect(() => {
        fnColor();
        fnColorSet();
        fnMenu();
    }, [])

    
        /*********시간관련 변수*********/
        var objWormTimer; // 지렁이 타이머
        var objComboTimer;  // 콤보 타이머
        var bolTimerStop = true;  // 지렁이 타이머 활성화 여부
        var numTurnCount = 1; // 지렁이가 움직인 횟수
        var numTimeCheck;  // 지렁이가 한번 움직일때마다 걸리는 시간. 1000 = 1초
        var numInitTimeCheck; //  지렁이속도 초기값
        var numHaste;  // 먹이를 먹을때마다 빨리지는 지렁이의 속도
        var numTimeCut; // 지렁이가 빨리질 수 있는 최대속도 제한
        /******크기, 위치관련 변수******/
        var arrWormMoveLeft = new Array();  // 매 턴마다 지렁이 머리의 Left값을 기억하는 배열
        var arrWormMoveTop = new Array(); // 매 턴마다 지렁이 머리의 Top값을 기억하는 배열
        var arrWormMoveWay = new Array(); // 매 턴마다 지렁이 머리의 방향을 기억하는 배열
        var numInitWormBodyCount; // 지렁이 몸체 초기값
        var numWormBodyCount; // 지렁이 몸체의 현재 갯수
        var numWidthCount;  // stage의 넓이
        var numHeightCount; // stage의 높이
        var numSquareWidth; // 지렁이의 넓이
        var numSquareHeight;  // 지렁이의 높이
        /**********그 외 변수**********/
        var strStatus = 'up'; // 키보드 방향키
        var strDifficulty = ''; // 선택한 난이도
        var strSkinSelect = 'default';
        var bolGameSet = false; // 게임 오버, 게임 클리어 시 true
        var bolFoodSet = false; // 지렁이 먹이 세팅 변수
        var bolCombo = false; // 콤보 유지관련 변수
        var numFoodCount = 0; // 먹이를 획득한 횟수
        var numComboCount = 0;  // 콤보 횟수
        var numScoreCount = 0;  // 현재 점수의 누적값
        var numRecordCount = 0; // 최고로 많은 점수 누적값
        var numLightColor = "#FFFFFF";  // 옅은 색깔
        var numHeavyColor = "#000000";  // 짙은 색깔 
        var numRandomLightColor = "#FFFFFF";  // 옅은 색깔의 헥사코드값을 임시로 저장하는 변수
        var numRandomHeavyColor = "#000000";  // 짙은 색깔의 헥사코드값을 임시로 저장하는 변수


        $(window).resize(function (e) {
            // fnResize();
        });



        function fnColor() {
            $('.select_skin .default').hover(function () {
                numRandomLightColor = "#FFFFFF";
                numRandomHeavyColor = "#000000";
                $(this).css({ 'background-color': numRandomHeavyColor, 'color': numRandomLightColor, 'border': 'solid 1px ' + numRandomLightColor });
            }, function () {
                $(this).css({ 'background-color': numRandomLightColor, 'color': numRandomHeavyColor, 'border': 'solid 1px ' + numRandomHeavyColor });
            }).click(function () {
                strSkinSelect = $(this).attr('class').split('menuBtn ')[1];
                fnColorSet();
            });
            $('.select_skin .red').hover(function () {
                numRandomLightColor = "#FF8B8B";
                numRandomHeavyColor = "#8B0000";
                $(this).css({ 'background-color': numRandomHeavyColor, 'color': numRandomLightColor, 'border': 'solid 1px ' + numRandomLightColor });
            }, function () {
                $(this).css({ 'background-color': numRandomLightColor, 'color': numRandomHeavyColor, 'border': 'solid 1px ' + numRandomHeavyColor });
            }).click(function () {
                strSkinSelect = $(this).attr('class').split('menuBtn ')[1];
                fnColorSet();
            });
            $('.select_skin .green').hover(function () {
                numRandomLightColor = "#A1FFA1";
                numRandomHeavyColor = "#008100";
                $(this).css({ 'background-color': numRandomHeavyColor, 'color': numRandomLightColor, 'border': 'solid 1px ' + numRandomLightColor });
            }, function () {
                $(this).css({ 'background-color': numRandomLightColor, 'color': numRandomHeavyColor, 'border': 'solid 1px ' + numRandomHeavyColor });
            }).click(function () {
                strSkinSelect = $(this).attr('class').split('menuBtn ')[1];
                fnColorSet();
            });
            $('.select_skin .blue').hover(function () {
                numRandomLightColor = "#8888FF";
                numRandomHeavyColor = "#000091";
                $(this).css({ 'background-color': numRandomHeavyColor, 'color': numRandomLightColor, 'border': 'solid 1px ' + numRandomLightColor });
            }, function () {
                $(this).css({ 'background-color': numRandomLightColor, 'color': numRandomHeavyColor, 'border': 'solid 1px ' + numRandomHeavyColor });
            }).click(function () {
                strSkinSelect = $(this).attr('class').split('menuBtn ')[1];
                fnColorSet();
            });
            $('.select_skin .random').hover(function () {
                var strLightRed = Math.floor(Math.random() * 255).toString(16);
                var strLightGreen = Math.floor(Math.random() * 255).toString(16);
                var strLightBlue = Math.floor(Math.random() * 255).toString(16);
                var strHeavyRed = Math.floor(Math.random() * 255).toString(16);
                var strHeavyGreen = Math.floor(Math.random() * 255).toString(16);
                var strHeavyBlue = Math.floor(Math.random() * 255).toString(16);
                numRandomLightColor = "#" + strLightRed + strLightGreen + strLightBlue;
                numRandomHeavyColor = "#" + strHeavyRed + strHeavyGreen + strHeavyBlue;
                $(this).css({ 'background-color': numRandomHeavyColor, 'color': numRandomLightColor, 'border': 'solid 1px ' + numRandomLightColor });
            }, function () {
                $(this).css({ 'background-color': numRandomLightColor, 'color': numRandomHeavyColor, 'border': 'solid 1px ' + numRandomHeavyColor });
            }).click(function () {
                fnColorSet();
            });
            $('#land .resetBtn').hover(function () {
                $(this).css({ 'background-color': numHeavyColor, 'color': numLightColor, 'border': 'solid 1px ' + numLightColor });
            }, function () {
                $(this).css({ 'background-color': numLightColor, 'color': numHeavyColor, 'border': 'solid 1px ' + numHeavyColor });
            }).click(function () {
                fnReset();
            })
            $('#land .restartBtn').hover(function () {
                $(this).css({ 'background-color': numHeavyColor, 'color': numLightColor, 'border': 'solid 1px ' + numLightColor });
            }, function () {
                $(this).css({ 'background-color': numLightColor, 'color': numHeavyColor, 'border': 'solid 1px ' + numHeavyColor });
            }).click(function () {
                fnRestart();
            })
        }

        function fnColorSet() {
            numLightColor = numRandomLightColor;
            numHeavyColor = numRandomHeavyColor;
            $('body').css({ 'background-color': numLightColor });
            $('.select_skin').css({ 'border': 'solid 1px ' + numHeavyColor });
            $('.select_skin .menu_text').css({ 'border': 'solid 1px ' + numHeavyColor, 'color': numHeavyColor, 'background-color': numLightColor });
            $('.select_difficulty').css({ 'border': 'solid 1px ' + numHeavyColor });
            $('.select_difficulty .menu_text').css({ 'border': 'solid 1px ' + numHeavyColor, 'color': numHeavyColor, 'background-color': numLightColor });
            $('.select_difficulty .startBtn').css({ 'border': 'solid 1px ' + numHeavyColor, 'color': numHeavyColor, 'background-color': numLightColor });
            $('.select_difficulty .menuBtn').css({ 'border': 'solid 1px ' + numHeavyColor, 'color': numHeavyColor, 'background-color': numLightColor });
            $('.select_difficulty .menuClick').css({ 'border': 'solid 1px ' + numLightColor, 'color': numLightColor, 'background-color': numHeavyColor });
            $('.select_difficulty .custumWrap').css({ 'border': 'solid 1px ' + numHeavyColor });
            $('.select_difficulty .custumWrap .cmenu label').css({ 'color': numHeavyColor });
            $('.select_difficulty .custumWrap .cmenu input').css({ 'border': 'solid 2px ' + numHeavyColor, 'color': numHeavyColor, 'background-color': numLightColor });
            $('#land #stage').css({ 'background-color': numLightColor, 'border': 'solid 1px ' + numHeavyColor });
            $('#land #score').css({ 'color': numHeavyColor });
            $('#land #score .information').css({ 'border': 'solid 3px ' + numHeavyColor });
            $('#land .resetBtn').css({ 'background-color': numLightColor, 'color': numHeavyColor, 'border': 'solid 1px ' + numHeavyColor });
            $('#land .restartBtn').css({ 'background-color': numLightColor, 'color': numHeavyColor, 'border': 'solid 1px ' + numHeavyColor });
        }

        function fnMenu() {  //초기 메뉴판에 상호작용을 추가하는 함수
            if (getCookie('numSquare') != "") {
                $('.custum_menu1 input').val(getCookie('numSquare'));
            }
            if (getCookie('numWormBodyCount') != "") {
                $('.custum_menu2 input').val(getCookie('numWormBodyCount'));
            }
            if (getCookie('numTimeCheck') != "") {
                $('.custum_menu3 input').val(getCookie('numTimeCheck'));
            }
            if (getCookie('numTimeCut') != "") {
                $('.custum_menu4 input').val(getCookie('numTimeCut'));
            }
            if (getCookie('numHaste') != "") {
                $('.custum_menu5 input').val(getCookie('numHaste'));
            }
            if (getCookie('numWidthCount') != "") {
                $('.custum_menu6 input').val(getCookie('numWidthCount'));
            }
            if (getCookie('numHeightCount') != "") {
                $('.custum_menu7 input').val(getCookie('numHeightCount'));
            }
            $('.select_difficulty .menuBtn').click(function () {
                $('.startBtn').css({ 'display': 'block' });
                $('.select_difficulty .menuBtn').removeClass('menuClick').css({ 'border': 'solid 1px ' + numHeavyColor, 'color': numHeavyColor, 'background-color': numLightColor });
                $(this).addClass('menuClick').css({ 'border': 'solid 1px ' + numLightColor, 'color': numLightColor, 'background-color': numHeavyColor });
                if ($(this).attr('class').split('menuClick')[0].split('menuBtn')[1].replace(/ /g, '') == 'custum') {
                    $('.custumWrap').show('Fold');
                }
                else {
                    $('.custumWrap').hide('Fold');
                }
            });
            $('.startBtn').click(function () {
                strDifficulty = $('.menuClick').attr('class').split('menuClick')[0].split('menuBtn')[1].replace(/ /g, '');
                if (strDifficulty == 'beginner') {
                    numTimeCheck = 200;
                    numHaste = 0.97;
                    numTimeCut = 100;
                    numWormBodyCount = 2;
                    numWidthCount = 600;
                    numHeightCount = 600;
                    numSquareWidth = 20;
                    numSquareHeight = 20;
                    numInitTimeCheck = numTimeCheck;
                    numInitWormBodyCount = numWormBodyCount;
                }
                else if (strDifficulty == 'normal') {
                    numTimeCheck = 200;
                    numHaste = 0.95;
                    numTimeCut = 40;
                    numWormBodyCount = 2;
                    numWidthCount = 600;
                    numHeightCount = 600;
                    numSquareWidth = 20;
                    numSquareHeight = 20;
                    numInitTimeCheck = numTimeCheck;
                    numInitWormBodyCount = numWormBodyCount;
                }
                else if (strDifficulty == 'expert') {
                    numTimeCheck = 150;
                    numHaste = 0.93;
                    numTimeCut = 30;
                    numWormBodyCount = 2;
                    numWidthCount = 600;
                    numHeightCount = 600;
                    numSquareWidth = 15;
                    numSquareHeight = 15;
                    numInitTimeCheck = numTimeCheck;
                    numInitWormBodyCount = numWormBodyCount;
                }
                else if (strDifficulty == 'custum') {
                    var numCmenu1 = $('.custum_menu1 input').val();
                    var numCmenu2 = $('.custum_menu2 input').val();
                    var numCmenu3 = $('.custum_menu3 input').val();
                    var numCmenu4 = $('.custum_menu4 input').val();
                    var numCmenu5 = $('.custum_menu5 input').val();
                    var numCmenu6 = $('.custum_menu6 input').val();
                    var numCmenu7 = $('.custum_menu7 input').val();
                    $('.cmenu span').html('');
                    if (isNaN(Number(numCmenu1))) {
                        $('.custum_menu1 span').html('* 숫자만 입력하세요.');
                        return;
                    }
                    else {
                        if (numCmenu1 == '') {
                            $('.custum_menu1 span').html('* 필수 입력');
                            return;
                        }
                        else {
                            if ((Number(numCmenu1)) <= 4) {
                                $('.custum_menu1 span').html('* 4보다 큰 숫자를 입력하세요.');
                                return;
                            }
                            else if ((Number(numCmenu1)) > 100) {
                                $('.custum_menu1 span').html('* 100보다 작거나 같은 숫자를 입력하세요.');
                                return;
                            }
                            else {
                                numSquareWidth = (Number(numCmenu1));
                                numSquareHeight = (Number(numCmenu1));
                                // setCookie("numSquare", Number(numCmenu1));
                            }
                        }
                    }
                    if (isNaN(Number(numCmenu2))) {
                        $('.custum_menu2 span').html('* 숫자만 입력하세요.');
                        return;
                    }
                    else {
                        if (numCmenu2 == '') {
                            $('.custum_menu2 span').html('* 필수 입력');
                            return;
                        }
                        else {
                            if ((Number(numCmenu2)) <= 0) {
                                $('.custum_menu2 span').html('* 0보다 큰 숫자를 입력하세요.');
                                return;
                            }
                            else if ((Number(numCmenu2)) > 20) {
                                $('.custum_menu2 span').html('* 20보다 작거나 같은 숫자를 입력하세요.');
                                return;
                            }
                            else {
                                numWormBodyCount = (Number(numCmenu2));
                                numInitWormBodyCount = (Number(numCmenu2));
                                // setCookie("numWormBodyCount", Number(numCmenu2));
                            }
                        }
                    }
                    if (isNaN(Number(numCmenu3))) {
                        $('.custum_menu3 span').html('* 숫자만 입력하세요.');
                        return;
                    }
                    else {
                        if (numCmenu3 == '') {
                            $('.custum_menu3 span').html('* 필수 입력');
                            return;
                        }
                        else {
                            if ((Number(numCmenu3)) <= 0) {
                                $('.custum_menu3 span').html('* 0보다 큰 숫자를 입력하세요.');
                                return;
                            }
                            else if ((Number(numCmenu3)) > 100) {
                                $('.custum_menu3 span').html('* 너무 빠릅니다. 100보다 작거나 같은 숫자를 입력하세요.');
                                return;
                            }
                            else {
                                numTimeCheck = Math.floor(1000 / (Number(numCmenu3)));
                                numInitTimeCheck = numTimeCheck;
                                // setCookie("numTimeCheck", Number(numCmenu3));
                            }
                        }
                    }
                    if (isNaN(Number(numCmenu4))) {
                        $('.custum_menu4 span').html('* 숫자만 입력하세요.');
                        return;
                    }
                    else {
                        if (numCmenu4 == '') {
                            $('.custum_menu4 span').html('* 필수 입력');
                            return;
                        }
                        else {
                            if ((Number(numCmenu4)) <= 0) {
                                $('.custum_menu4 span').html('* 0보다 큰 숫자를 입력하세요.');
                                return;
                            }
                            else if ((Number(numCmenu4)) > 1000) {
                                $('.custum_menu4 span').html('* 너무 빠릅니다. 1000보다 작거나 같은 숫자를 입력하세요.');
                                return;
                            }
                            else if ((Number(numCmenu4)) < (Number(numCmenu3))) {
                                $('.custum_menu4 span').html('* 최대속도가 현재속도보다 느립니다.');
                                return;
                            }
                            else {
                                numTimeCut = Math.floor(1000 / (Number(numCmenu4)));
                                // setCookie("numTimeCut", Number(numCmenu4));
                            }
                        }
                    }
                    if (isNaN(Number(numCmenu5))) {
                        $('.custum_menu5 span').html('* 숫자만 입력하세요.');
                        return;
                    }
                    else {
                        if (numCmenu5 == '') {
                            $('.custum_menu5 span').html('* 필수 입력');
                            return;
                        }
                        else {
                            if ((Number(numCmenu5)) < 0) {
                                $('.custum_menu5 span').html('* 0보다 크거나 같은 숫자를 입력하세요.');
                                return;
                            }
                            else if ((Number(numCmenu5)) > 100) {
                                $('.custum_menu5 span').html('* 너무 빠릅니다. 100보다 작은 숫자를 입력하세요.');
                                return;
                            }
                            else {
                                numHaste = (1 - (Number(numCmenu5) * 0.01));
                                // setCookie("numHaste", Number(numCmenu5));
                            }
                        }
                    }
                    if (isNaN(Number(numCmenu6))) {
                        $('.custum_menu6 span').html('* 숫자만 입력하세요.');
                        return;
                    }
                    else {
                        if (numCmenu6 == '') {
                            $('.custum_menu6 span').html('* 필수 입력');
                            return;
                        }
                        else {
                            if ((Number(numCmenu6)) <= 0) {
                                $('.custum_menu6 span').html('* 0보다 큰 숫자를 입력하세요.');
                                return;
                            }
                            else if ((Number(numCmenu6)) <= 100) {
                                $('.custum_menu6 span').html('* 너무 작습니다. 100보다 큰 숫자를 입력하세요.');
                                return;
                            }
                            else if ((Number(numCmenu6)) % (Number(numCmenu1)) != 0) {
                                $('.custum_menu6 span').html('* 지렁이와 스테이지의 사이즈가 맞지 않습니다.');
                                return;
                            }
                            else {
                                numWidthCount = Number(numCmenu6);
                                // setCookie("numWidthCount", Number(numCmenu6));
                            }
                        }
                    }
                    if (isNaN(Number(numCmenu7))) {
                        $('.custum_menu7 span').html('* 숫자만 입력하세요.');
                        return;
                    }
                    else {
                        if (numCmenu7 == '') {
                            $('.custum_menu7 span').html('* 필수 입력');
                            return;
                        }
                        else {
                            if ((Number(numCmenu7)) <= 0) {
                                $('.custum_menu7 span').html('* 0보다 큰 숫자를 입력하세요.');
                                return;
                            }
                            else if ((Number(numCmenu7)) <= 100) {
                                $('.custum_menu7 span').html('* 너무 작습니다. 100보다 큰 숫자를 입력하세요.');
                                return;
                            }
                            else if ((Number(numCmenu7)) % (Number(numCmenu1)) != 0) {
                                $('.custum_menu7 span').html('* 지렁이와 스테이지의 사이즈가 맞지 않습니다.');
                                return;
                            }
                            else {
                                numHeightCount = Number(numCmenu7);
                                // setCookie("numHeightCount", Number(numCmenu7));
                            }
                        }
                    }
                }
                $('.gamemenu').hide('Fold')
                fnInit();
                fnWormSet();

            });
        }

        function fnInit() {  //지렁이게임 스테이지를 구성하는 함수
            var strAppendTag = '';
            var numWidthLineCount = numWidthCount / numSquareWidth;
            var numHeightLineCount = numHeightCount / numSquareHeight;
            numRecordCount = 0;
            $('.recordCount').html(numRecordCount);
            for (var i = 1; i <= numWidthLineCount; i++) {
                strAppendTag += '<span class = "line width_' + i + '" style = "background-color : ' + numHeavyColor + '; width : 1px; height : ' + numHeightCount + 'px; left : ' + (i * numSquareWidth) + 'px; top : 0px"></span>';
            }
            for (var j = 1; j <= numHeightLineCount; j++) {
                strAppendTag += '<span class = "line height_' + j + '" style = "background-color : ' + numHeavyColor + '; width : ' + numWidthCount + 'px; height : 1px; left : 0px; top : ' + (j * numSquareHeight) + 'px"></span>';
            }
            strAppendTag += '<div class = "count_wrap">';
            strAppendTag += '<div class = "count_ready">Ready...</div>';
            strAppendTag += '<div class = "count_go">Go!!</div>';
            strAppendTag += '</div>';
            $('#land').css({ 'width': numHeightCount + Number($('#score').css('width').split('px')[0]) + 4 + 'px' }).delay(300).show('Fold', function foldNext() { fnGameStartAnimate1() });
            $('#stage').append(strAppendTag).css({ 'width': numWidthCount + 'px', 'height': numHeightCount + 'px' });
            $('.count_ready').css({ 'line-height': Number($('#stage').css('height').split('px')[0]) + Number($('.count_ready').css('font-size').split('px')[0] * 0.5) + 'px' });
            $('.count_go').css({ 'line-height': Number($('#stage').css('height').split('px')[0]) + Number($('.count_go').css('font-size').split('px')[0] * 0.5) + 'px' });

            if (strDifficulty == 'beginner') {
                if (getCookie('beginner') != "") {
                    numRecordCount = Number(getCookie('beginner'));
                    $('.recordCount').html(numRecordCount);
                }
            }
            else if (strDifficulty == 'normal') {
                if (getCookie('normal') != "") {
                    numRecordCount = Number(getCookie('normal'));
                    $('.recordCount').html(numRecordCount);
                }
            }
            else if (strDifficulty == 'expert') {
                if (getCookie('expert') != "") {
                    numRecordCount = Number(getCookie('expert'));
                    $('.recordCount').html(numRecordCount);
                }
            }
            else if (strDifficulty == 'custum') {
                if (getCookie('custum') != "") {
                    numRecordCount = Number(getCookie('custum'));
                    $('.recordCount').html(numRecordCount);
                }
            }
        }

        function fnWormSet() { //지렁이의 머리와 몸체를 생성하는 함수
            var strWormHead = '<div id = "head" class = "worms worm_head"></div>';
            var strWormBody = '';
            $('#stage').append(strWormHead);
            if ((numWidthCount / numSquareWidth) % 2 == 0) { // 짝수면
                $('.worm_head').css({ 'left': (numWidthCount / 2) + 'px' });
            }
            else { // 홀수면
                $('.worm_head').css({ 'left': (numWidthCount / 2) - (numSquareWidth / 2) + 'px' });
            }
            if ((numHeightCount / numSquareHeight) % 2 == 0) {  // 짝수면
                $('.worm_head').css({ 'top': (numHeightCount / 2) + 'px' });
            }
            else { // 홀수면
                $('.worm_head').css({ 'top': (numHeightCount / 2) + (numSquareHeight / 2) + 'px' });
            }
            $('.worm_head').css({ 'width': numSquareWidth + 'px', 'height': numSquareHeight + 'px', 'border': 'solid ' + Number(((numSquareWidth / 2) - (numSquareWidth * 0.1)).toFixed(0)) + 'px ' + numHeavyColor, 'background-color': numLightColor });
            for (var i = 1; i <= numWormBodyCount; i++) {
                strWormBody += '<div class = "worms worm_body body_' + i + '" style = "background-color : ' + numHeavyColor + '; width : ' + numSquareWidth + 'px; height : ' + numSquareHeight + 'px; left : ' + Number($('#head').css('left').split('px')[0]) + 'px; top : ' + Number($('#head').css('top').split('px')[0]) + 'px;"></div>';
            }
            $('#stage').append(strWormBody);
        }

        function fnGameStartAnimate1() {
            $('#stage').css({ 'animation': '' });
            $('.count_ready').html('Ready...').show();
            $('.count_go').html('Go!!').hide();
            $('.count_wrap').css({ 'animation': 'startAnimate1 1.5s 1 forwards linear' });
            setTimeout(fnGameStartAnimate2, 1500);
        }

        function fnGameStartAnimate2() {
            $('.count_ready').html('Ready...').hide();
            $('.count_go').html('Go!!').show();
            $('.count_wrap').css({ 'animation': 'startAnimate2 1.5s 1 forwards linear' });
            setTimeout(fnGameStart, 1500);
        }

        function fnGameStart() {
            console.log("게임 시작!");
            objWormTimer = setInterval(fnTimeUpdate, numTimeCheck);
            bolTimerStop = false;
        }

        function fnGameStop() {
            console.log("게임 정지!");
            clearInterval(objWormTimer);
            clearTimeout(objComboTimer);
            fnComboReset();
            bolTimerStop = true;
        }

        function fnGameClear() {  // 게임을 클리어 했을 때 호출하는 함수
            fnGameStop();
            bolGameSet = true;
            $('.count_go').html('Game Clear!!').css({ 'display': 'block', 'animation': 'clearTextAnimate 1s infinite linear' });
            $('.count_wrap').css({ 'animation': 'clearAnimate 1s 1 forwards linear' });
            $('.restart').delay(500).show('Slide');
        }

        function fnGameOver() {  // 게임이 끝났을 때 호출하는 함수
            var options = {};
            if (bolGameSet) {
                $('.worms').effect('bounce', options, 500, fnGameEnd());
            }
            else {
                $('#stage').effect('shake', options, 300, fnGameEnd());
            }
            fnGameStop();
            bolGameSet = true;
            $('.count_go').html('Game Over').show();
            $('.count_wrap').css({ 'animation': 'endAnimate 1.5s 1 forwards linear' });
        }

        function fnGameEnd() {
            $('.worm_head').css({ 'animation': 'headColorAnimate 0.3s infinite linear', 'animation-direction': 'alternate' });
            $('.restart').delay(500).show('Slide');
            $('#stage').css({ 'animation': 'gameOverAnimate 1.5s 1 forwards linear' });
        }

        function fnReset() { //게임 초기화 함수
            if (!bolTimerStop || bolGameSet) {
                fnGameStop();
                $('.restart').hide();
                $('#land').hide('Fold', function foldNext() {
                    $('#stage').empty();
                    $('.menu').show('Fold');
                    arrWormMoveLeft = new Array();
                    arrWormMoveTop = new Array();
                    arrWormMoveWay = new Array();
                    strStatus = 'up';
                    numTurnCount = 1;
                    bolGameSet = false;
                    bolFoodSet = false;
                    numFoodCount = 0;
                    numScoreCount = 0;
                    $('.foodCount').html(numFoodCount);
                    $('.scoreCount').html(numScoreCount);
                    $('.recordRenewal').hide();
                });
            }
            else return;
        }

        function fnRestart() {
            var options = {};
            $('.restart').hide();
            $('#stage').effect('pulsate', options, 500, fnRestartEnd());
        }

        function fnRestartEnd() {
            setTimeout(function () {
                arrWormMoveLeft = new Array();
                arrWormMoveTop = new Array();
                arrWormMoveWay = new Array();
                strStatus = 'up';
                numTurnCount = 1;
                numTimeCheck = numInitTimeCheck;
                numWormBodyCount = numInitWormBodyCount;
                bolGameSet = false;
                bolFoodSet = false;
                numFoodCount = 0;
                numScoreCount = 0;
                $('.foodCount').html(numFoodCount);
                $('.scoreCount').html(numScoreCount);
                $('.recordRenewal').hide();
                $('#stage').empty().css({ 'animation-name': 'gameRestartAnimate' });
                fnInit();
                fnWormSet();
            }, 500)
        }

        function fnFoodSetting() { //스테이지에서 지렁이와 겹치지 않는 곳에 랜덤하게 먹이를 생성하는 함수
            var arrFoodSpace = new Array();
            var arrWormsSpace = new Array();
            var numSpaceCount = 0;
            var numWormsCount = 0;
            var numRandomSpace;
            var numLeftCount = Number(numWidthCount / numSquareWidth);
            var numTopCount = Number(numHeightCount / numSquareHeight);

            $('.worms').each(function () {
                arrWormsSpace[numWormsCount] = [Number($(this).css('left').split('px')[0]), Number($(this).css('top').split('px')[0])];
                numWormsCount++;
            });
            for (var i = 0; i < numTopCount; i++) {
                for (var j = 0; j < numLeftCount; j++) {
                    var numOverlapCheck = 0;
                    for (var k = 0; k < arrWormsSpace.length; k++) {
                        if (arrWormsSpace[k][0] == (numSquareWidth * j) && arrWormsSpace[k][1] == (numSquareHeight * i)) {
                            numOverlapCheck++;
                        }
                    }
                    if (!numOverlapCheck) {
                        arrFoodSpace[numSpaceCount] = [Number(numSquareWidth * j), Number(numSquareHeight * i)];
                        numSpaceCount++;
                    }
                }
            }
            if (arrFoodSpace.length > 0) {
                numRandomSpace = Math.floor(Math.random() * arrFoodSpace.length);
                $('#stage').append('<div id = "food"></div>');
                $('#food').css({ 'width': numSquareWidth - 1 + 'px', 'height': numSquareHeight - 1 + 'px', 'left': arrFoodSpace[numRandomSpace][0] + 'px', 'top': arrFoodSpace[numRandomSpace][1] + 'px', 'background-color': numHeavyColor, 'border': 'solid 1px ' + numLightColor });
            }
            else {
                fnGameClear();
            }

        }

        function fnCombo() {
            try {
                clearTimeout(objComboTimer);
            } catch (e) {

            }
            numComboCount++;
            $('.comboCount').html(numComboCount);
            fnComboStart();
        }

        function fnComboStart() {
            if (!bolCombo) {
                $('.combo').css({ 'animation': 'comboStart1 5s 1 forwards linear' });
                $('.comboCount').css({ 'animation': 'comboText1 0.5s 1 forwards linear' });
                bolCombo = true;
            }
            else {
                $('.combo').css({ 'animation': 'comboStart2 5s 1 forwards linear' });
                $('.comboCount').css({ 'animation': 'comboText2 0.5s 1 forwards linear' });
                bolCombo = false;
            }
            objComboTimer = setTimeout(fnComboReset, 5000);
        }

        function fnComboReset() {
            numComboCount = 0;
            $('.comboCount').html(numComboCount);
            $('.combo').css({ 'animation': 'comboEnd 0s 1 forwards linear' });
        }

        // 쿠키저장
        function setCookie(name, value) {
            var argc = setCookie.arguments.length;
            var argv = setCookie.arguments;
            var expires = (argc > 2) ? argv[2] : null;
            var path = (argc > 3) ? argv[3] : null;
            var domain = (argc > 4) ? argv[4] : null;
            var secure = (argc > 5) ? argv[5] : false;

            expires = new Date();
            expires.setDate(expires.getDate() + 1000);

            document.cookie = name + "=" + escape(value) +
                ((expires == null) ? "" : ("; expires =" + expires.toGMTString())) +
                ((path == null) ? "" : ("; path =" + path)) +
                ((domain == null) ? "" : ("; domain =" + domain)) +
                ((domain == true) ? "; secure" : "");
        }

        // 쿠키 가져오기
        function getCookie(name) {
            var dcookie = document.cookie;
            var cname = name + "=";
            var clen = dcookie.length;
            var cbegin = 0;
            while (cbegin < clen) {
                var vbegin = cbegin + cname.length;
                if (dcookie.substring(cbegin, vbegin) == cname) {
                    var vend = dcookie.indexOf(";", vbegin);
                    if (vend == -1) vend = clen;
                    return unescape(dcookie.substring(vbegin, vend));
                }
                cbegin = dcookie.indexOf(" ", cbegin) + 1;
                if (cbegin == 0) break;
            }
            return "";
        }

        function fnTimeUpdate() {  // 지렁이가 스테이지를 한 칸 움직일 때마다 호출되는 함수
            // 현재 지렁이 머리의 Left, Top값을 가져옴
            var numHeadWidth = Number($('#head').css('left').split('px')[0]);
            var numHeadHeight = Number($('#head').css('top').split('px')[0]);
            // 어떤 방향키를 눌렀는가를 구분짓고 stage 바깥으로 바가는 순간 fnGameOver()함수 호출
            if (strStatus == 'left') {
                if ((numHeadWidth - numSquareWidth) < 0) {
                    fnGameOver();
                    return;
                }
                else if (arrWormMoveWay[numTurnCount - 1] == 'right') {
                    if ((numHeadWidth + numSquareWidth) >= numWidthCount) {
                        fnGameOver();
                        return;
                    }
                    else {
                        $('#head').css({ 'left': (numHeadWidth + numSquareWidth) + 'px' });
                        strStatus = 'right';
                    }
                }
                else {
                    $('#head').css({ 'left': (numHeadWidth - numSquareWidth) + 'px', 'border-radius': Number((numSquareWidth / 2).toFixed(0)) + 'px 0px 0px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px' });
                }
            }
            else if (strStatus == 'up') {
                if ((numHeadHeight - numSquareHeight) < 0) {
                    fnGameOver();
                    return;
                }
                else if (arrWormMoveWay[numTurnCount - 1] == 'down') {
                    if ((numHeadHeight + numSquareHeight) >= numHeightCount) {
                        fnGameOver();
                        return;
                    }
                    else {
                        $('#head').css({ 'top': (numHeadHeight + numSquareHeight) + 'px' });
                        strStatus = 'down';
                    }
                }
                else {
                    $('#head').css({ 'top': (numHeadHeight - numSquareHeight) + 'px', 'border-radius': Number((numSquareWidth / 2).toFixed(0)) + 'px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px 0px 0px' });
                }
            }
            else if (strStatus == 'right') {
                if ((numHeadWidth + numSquareWidth) >= numWidthCount) {
                    fnGameOver();
                    return;
                }
                else if (arrWormMoveWay[numTurnCount - 1] == 'left') {
                    if ((numHeadWidth - numSquareWidth) < 0) {
                        fnGameOver();
                        return;
                    }
                    else {
                        $('#head').css({ 'left': (numHeadWidth - numSquareWidth) + 'px' });
                        strStatus = 'left';
                    }
                }
                else {
                    $('#head').css({ 'left': (numHeadWidth + numSquareWidth) + 'px', 'border-radius': '0px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px 0px' });
                }
            }
            else if (strStatus == 'down') {
                if ((numHeadHeight + numSquareHeight) >= numHeightCount) {
                    fnGameOver();
                    return;
                }
                else if (arrWormMoveWay[numTurnCount - 1] == 'up') {
                    if ((numHeadHeight - numSquareHeight) < 0) {
                        fnGameOver();
                        return;
                    }
                    else {
                        $('#head').css({ 'top': (numHeadHeight - numSquareHeight) + 'px' });
                        strStatus = 'up';
                    }
                }
                else {
                    $('#head').css({ 'top': (numHeadHeight + numSquareHeight) + 'px', 'border-radius': '0px 0px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px' });
                }
            }
            // 누른 방향키의 방향대로 움직인 다음 지렁이 머리의 Left, Top 값을 배열에 저장. 그리고 어떤 방향으로 움직였는지도 기록.
            arrWormMoveLeft[numTurnCount] = Number($('#head').css('left').split('px')[0]);
            arrWormMoveTop[numTurnCount] = Number($('#head').css('top').split('px')[0]);
            arrWormMoveWay[numTurnCount] = strStatus;
            numTurnCount++; // 턴 증가
            // 현재 지렁이의 길이가 numWormBodyCount보다 작을 경우 몸체를 1씩 추가
            if ($('.worms').length < numWormBodyCount) {
                var strBodyAppend = '<div class = "worms worm_body body_' + $('.worms').length + '" style = "background-color : ' + numHeavyColor + '; width : ' + numSquareWidth + 'px; height : ' + numSquareHeight + 'px; left : ' + arrWormMoveLeft[numTurnCount - ($('.worms').length)] + 'px; top : ' + arrWormMoveTop[numTurnCount - ($('.worms').length)] + 'px;"></div>';
                $('#stage').append(strBodyAppend);
            }
            //
            if ((numTurnCount - 1) >= numWormBodyCount && !bolFoodSet) {
                bolFoodSet = true;
                fnFoodSetting();
            }
            try {  // 지렁이의 머리와 먹이가 닿을 경우 몸통을 한 칸 늘리도록 처리
                if (Number($('#head').css('left').split('px')[0]) == Number($('#food').css('left').split('px')[0]) && Number($('#head').css('top').split('px')[0]) == Number($('#food').css('top').split('px')[0])) {
                    fnCombo();
                    bolFoodSet = false;
                    $('#food').remove();
                    numWormBodyCount++;
                    numFoodCount++;
                    $('.foodCount').html(numFoodCount);
                    numTimeCheck = Math.floor(numTimeCheck * numHaste);
                    if (numTimeCheck < numTimeCut) {
                        numTimeCheck = numTimeCut;
                    }
                    clearInterval(objWormTimer);
                    objWormTimer = setInterval(fnTimeUpdate, numTimeCheck);
                    numScoreCount += Math.floor(100 * (0.1 * numComboCount + 1));
                    $('.scoreCount').html(numScoreCount);
                    if (numScoreCount > numRecordCount) {
                        $('.recordCount').html(numScoreCount);
                        $('.recordRenewal').show('Fold');
                        $('.recordRenewal').css({ 'left': $('.recordCount').position().left + $('.recordCount').width() + 5 + 'px', 'top': $('.recordCount').position().top + ($('.recordCount').height() * 0.1) + 'px' });
                        // if (strDifficulty == 'beginner') {
                        //     setCookie('beginner', numScoreCount)
                        // }
                        // else if (strDifficulty == 'normal') {
                        //     setCookie('normal', numScoreCount)
                        // }
                        // else if (strDifficulty == 'expert') {
                        //     setCookie('expert', numScoreCount)
                        // }
                        // else if (strDifficulty == 'custum') {
                        //     setCookie('custum', numScoreCount)
                        // }
                        // setCookie(strDifficulty, numScoreCount)
                    }
                }
            } catch (e) {

            }

            // 지렁이의 몸체가 머리를 따라오도록 하는 함수
            $('.worm_body').each(function () {
                var numClass = Number($(this).attr('class').split('body_')[1]) + 1;
                $(this).css({ 'width': numSquareWidth + 'px', 'height': numSquareHeight + 'px', 'left': arrWormMoveLeft[numTurnCount - numClass] + 'px', 'top': arrWormMoveTop[numTurnCount - numClass] + 'px', 'border-radius': '0px 0px 0px 0px' });
                var numBodyLeft = Number($(this).css('left').split('px')[0]);
                var numBodyTop = Number($(this).css('top').split('px')[0]);
                if (arrWormMoveLeft[numTurnCount - 1] == numBodyLeft && arrWormMoveTop[numTurnCount - 1] == numBodyTop) { //지렁이의 머리와 몸통이 닿으면 게임오버 함수 호출
                    bolGameSet = true;
                }
                if (Number($('.worms').length) == numClass) { //지렁이의 꼬리부분을 둥그렇게 처리함
                    if (arrWormMoveWay[numTurnCount - numClass] == 'left') {
                        $(this).css({ 'border-radius': '0px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px 0px' });
                    }
                    else if (arrWormMoveWay[numTurnCount - numClass] == 'up') {
                        $(this).css({ 'border-radius': '0px 0px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px' });
                    }
                    else if (arrWormMoveWay[numTurnCount - numClass] == 'right') {
                        $(this).css({ 'width': numSquareWidth + 1 + 'px', 'border-radius': Number((numSquareWidth / 2).toFixed(0)) + 'px 0px 0px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px' });
                    }
                    else if (arrWormMoveWay[numTurnCount - numClass] == 'down') {
                        $(this).css({ 'border-radius': Number((numSquareWidth / 2).toFixed(0)) + 'px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px 0px 0px' });
                    }
                    if (arrWormMoveWay[numTurnCount - numClass] != arrWormMoveWay[numTurnCount - numClass + 1]) { // 지렁이의 꼬리부분을 자연스럽도록 처리함
                        if (arrWormMoveWay[numTurnCount - numClass + 1] == 'left') {
                            $(this).css({ 'width': numSquareWidth + 'px', 'border-radius': '0px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px 0px' });
                        }
                        else if (arrWormMoveWay[numTurnCount - numClass + 1] == 'up') {
                            $(this).css({ 'width': numSquareWidth + 'px', 'border-radius': '0px 0px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px' });
                        }
                        else if (arrWormMoveWay[numTurnCount - numClass + 1] == 'right') {
                            $(this).css({ 'width': numSquareWidth + 1 + 'px', 'border-radius': Number((numSquareWidth / 2).toFixed(0)) + 'px 0px 0px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px' });
                        }
                        else if (arrWormMoveWay[numTurnCount - numClass + 1] == 'down') {
                            $(this).css({ 'width': numSquareWidth + 'px', 'border-radius': Number((numSquareWidth / 2).toFixed(0)) + 'px ' + Number((numSquareWidth / 2).toFixed(0)) + 'px 0px 0px' });
                        }
                    }
                }
            });

            if (bolGameSet) { //지렁이의 머리와 몸통이 닿으면 게임오버 함수 호출
                fnGameOver();
                return;
            };
        }

        document.addEventListener('keydown', function (e) {
            // if(e.keyCode == 32){	// 스페이스
            //   if(bolTimerStop){
            //     fnGameStart();
            //   }
            //   else{
            //     fnGameStop();
            //   }
            // }
            if (e.keyCode == 27) {	// ESC
                fnReset();
            }
            if (e.keyCode == 37) {	// ←
                strStatus = 'left';
            }
            if (e.keyCode == 38) {	// ↑
                strStatus = 'up';
            }
            if (e.keyCode == 39) {	// →
                strStatus = 'right';
            }
            if (e.keyCode == 40) {	// ↓
                strStatus = 'down';
            }
        })

    return (
        <div style={{ width: "85%", margin: "0 auto", height: "calc(100vh - 80px - 69px)", position: 'relative' }}>
            <div className='gamemenu'>
                <div className='select_skin'>
                    <div className='menu_text'>스킨</div>
                    <div className='menuBtn default'>기본</div>
                    <div className='menuBtn red'>붉은색</div>
                    <div className='menuBtn green'>초록색</div>
                    <div className='menuBtn blue'>파란색</div>
                    <div className='menuBtn random'>랜덤</div>
                </div>
                <div className='select_difficulty'>
                    <div className='menu_text'>난이도</div>
                    <div className='startBtn'>start</div>
                    <div className='menuBtn beginner'>쉬움</div>
                    <div className='menuBtn normal'>보통</div>
                    <div className='menuBtn expert'>어려움</div>
                    <div className='menuBtn custum'>커스텀</div>
                    <div className='custumWrap'>
                        <div className='cmenu custum_menu1'>
                            <label>지렁이 크기 : </label>
                            <input type='text' maxlength='3' placeholder="지렁이 크기" value='20' />
                            <label>px</label>
                            <span></span>
                        </div>
                        <div className='cmenu custum_menu2'>
                            <label>지렁이 몸체 갯수 : </label>
                            <input type='text' maxlength='2' placeholder="지렁이 몸체 갯수" value='2' />
                            <label>개</label>
                            <span></span>
                        </div>
                        <div className='cmenu custum_menu3'>
                            <label>지렁이 초당 속도 : </label>
                            <input type='text' maxlength='3' placeholder="지렁이 초당 속도" value='5' />
                            <label>번</label>
                            <span></span>
                        </div>
                        <div className='cmenu custum_menu4'>
                            <label>지렁이의 최대 속도 : </label>
                            <input type='text' maxlength='4' placeholder="지렁이의 최대 속도" value='25' />
                            <label>번</label>
                            <span></span>
                        </div>
                        <div className='cmenu custum_menu5'>
                            <label>먹이를 먹을때마다 빨라지는 정도 : </label>
                            <input type='text' maxlength='2' placeholder="먹이를 먹을때마다 빨라지는 정도" value='5' />
                            <label>%</label>
                            <span></span>
                        </div>
                        <div className='cmenu custum_menu6'>
                            <label>스테이지 넓이 : </label>
                            <input type='text' maxlength='4' placeholder="스테이지 넓이" value='600' />
                            <label>px</label>
                            <span></span>
                        </div>
                        <div className='cmenu custum_menu7'>
                            <label>스테이지 높이 : </label>
                            <input type='text' maxlength='4' placeholder="스테이지 높이" value='600' />
                            <label>px</label>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
            <div id='land'>
                <div id='stage'></div>
                <div id='score'>
                    <div className='combo'>
                        <div className="comboCount">0</div>
                        <div className="comboText">Combo!!</div>
                    </div>
                    <div className='recordScore'>
                        <div className="recordText">최고 score : </div>
                        <div className="recordCount">0</div>
                        <div className="recordRenewal">갱신중!!!</div>
                    </div>
                    <div className='totalScore'>
                        <div className="scoreText">현재 score : </div>
                        <div className="scoreCount">0</div>
                    </div>
                    <div className='totalFood'>
                        <div className='foodText'>먹이 획득 갯수 : </div>
                        <div className='foodCount'>0</div>
                    </div>
                    <div className='information'>※조작법※<br />☞ 방향키로 이동 ☜<br /><br />↑ = 위로 이동<br />→ = 오른쪽으로 이동<br />← = 왼쪽으로 이동<br />↓ = 아래로 이동<br /></div>
                </div>
                <div className='restart'>
                    <div className='resetBtn'>메뉴로 이동</div>
                    <div className='restartBtn'>다시 시작 수정</div>
                </div>
            </div>
        </div>
    );
}

export default GamePage;
