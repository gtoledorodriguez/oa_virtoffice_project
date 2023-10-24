import React, {useEffect, useRef, useState} from "react";
import InitiatedVideoCall from './InitiatedVideoCall';
import { connect } from "react-redux";
import { MY_CHARACTER_INIT_CONFIG } from "./characterConstants";

function VideoCalls({ myCharacterData, otherCharactersData, webrtcSocket}) {
    const [myStream, setMyStream] = useState();
    useEffect(() => {
        console.log('ue');
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((stream) => {
            setMyStream(stream);
        });
    }, []);
    
    const myUserId = myCharacterData?.id;
    const initiateCallToUSers = Object.keys(otherCharactersData)
    .filter((othersUserId) => othersUserId != myUserId)
    .reduce((filteredObj, key) => {
        filteredObj[key] = otherCharactersData[key];
        return filteredObj;
    }, []);

    return <> {
        myCharacterData && <div className="videos">
            { Object.keys(initiateCallToUSers).map((othersUserId) => {

                return <InitiatedVideoCall
                key={initiateCallToUSers[othersUserId].socketId}
                mySocketId={myCharacterData.socketId}
                myStream={myStream}
                othersSocketId={initiateCallToUSers[othersUserId].socketId}
                webrtcSocket={webrtcSocket} />
            })}
        </div>
    } </>;
}