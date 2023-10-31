import React, {useEffect, useRef, useState} from "react";
import InitiatedVideoCall from './InitiatedVideoCall';
//import Recieved Video Calls
import MyVideo from './MyVideo';
import { connect } from "react-redux";
import { MY_CHARACTER_INIT_CONFIG } from "./characterConstants";

function VideoCalls({ myCharacterData, otherCharactersData, webrtcSocket}) {
    const [myStream, setMyStream] = useState();
    const [offersRecieved, setOffersReceived] = useState({}); //key->socketId value->offer
    useEffect(() => {
        console.log('ue');
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then((stream) => {
            setMyStream(stream);
        });
    }, []);
    useEffect(() => {
        webrtcSocket.on("receiveOffer", payload => {
            console.log("received offer from ", payload.callFromUserSocketId, ", offers Received: ", Object.keys(payload.offerSignal));
            if( !Object.keys(offersRecieved).includes(payload.callFromUserSocketId)) {
                setOffersReceived({
                    ...offersRecieved,
                    [payload.callFromUserSocketId]: payload.offerSignal,
                });
            }
        });
    }, [webrtcSocket, offersRecieved]);
    
    const myUserId = myCharacterData?.id;
    const initiateCallToUSers = Object.keys(otherCharactersData)
    .filter((othersUserId) => othersUserId != myUserId)
    .reduce((filteredObj, key) => {
        filteredObj[key] = otherCharactersData[key];
        return filteredObj;
    }, {});

    return <> {
        myCharacterData && <div className="videos">
            <MyVideo myStream={myStream} />
            { Object.keys(initiateCallToUSers).map((othersUserId) => {
                return <InitiatedVideoCall
                key={initiateCallToUSers[othersUserId].socketId}
                mySocketId={myCharacterData.socketId}
                myStream={myStream}
                othersSocketId={initiateCallToUSers[othersUserId].socketId}
                webrtcSocket={webrtcSocket} />
            })}
            {/* {
                Object.keys(offersRecieved).map((othersSocketId) => {
                    const matchingUserIds = Object.keys(otherCharactersData)
                    .filter((othersUserId) => otherCharactersData[othersUserId].socketId === othersSocketId)

                    console.assert(
                        matchingUserIds.length === 1,
                        "Unexpected list of matching user ids",
                        matchingUserIds
                    )

                    return <ReceivedVideoCall 
                        key={othersSocketId}
                        mySocketId={myCharacterData.socketId}
                        myStream={myStream}
                        othersSocketId={othersSocketId}
                        webrtcSocket={webrtcSocket}
                        offerSignal={offersRecieved[othersSocketId]} />
                })
            } */}
        </div>
    } </>;
}

const mapStateToProps = (state) => {
    const myCharacterData = state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id];
    const otherCharactersData = Object.keys(state.allCharacters.users)
    .filter(id => id != MY_CHARACTER_INIT_CONFIG.id)
    .reduce((filteredObj, key) => {
        filteredObj[key] = state.allCharacters.users[key]; 
        return filteredObj;
    }, {});
    return {myCharacterData: myCharacterData, otherCharactersData: otherCharactersData};
}

export default connect(mapStateToProps, {}) (VideoCalls);