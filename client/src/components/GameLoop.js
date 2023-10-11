import React, {useCallback, useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import CanvasContext from './CanvasContext';

import {MOVE_DIRECTIONS, MAP_DIMENSIONS, TILE_SIZE} from './mapConstants';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import {checkMapCollision} from './utils';

import {update as updateAllCharactersData} from './slices/allCharactersSlice'
import { firebaseDatabase } from '../firebase/firebase';
import { ref, set, onValue } from "firebase/database";

const GameLoop = ({children, allCharactersData, updateAllCharactersData}) => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    useEffect(() => {
        // frameCount used for re-rendering child components
        console.log("initial setContext");
        setContext({canvas: canvasRef.current.getContext('2d'), frameCount: 0});
    }, [setContext]);

    // keeps the reference to the main rendering loop
    const loopRef = useRef();
    const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];

    const moveMyCharacter = useCallback((e) => {
        var currentPosition = mycharacterData.position;
        const key = e.key;
        if (MOVE_DIRECTIONS[key]) {
            // ***********************************************
            // TODO: Add your move logic here

            console.log("Start: ", currentPosition);

            const [x, y] = MOVE_DIRECTIONS[key];
            var xPos = currentPosition.x + x;
            var yPos = currentPosition.y + y;

            if(!checkMapCollision(xPos,yPos)){ 
                const newPos = {
                    x: xPos,
                    y: yPos
                };
                // From app to redux:
                //
                // const updateMyCharacterData = {
                //     ...mycharacterData, 
                //     position: newPos
                // };
                // const updatedUsersList = {
                //     ...allCharactersData
                // };
                // updatedUsersList[MY_CHARACTER_INIT_CONFIG.id] = updateMyCharacterData;
                // updateAllCharactersData(updatedUsersList);

                const posRef = ref(firebaseDatabase, 'users/'+ MY_CHARACTER_INIT_CONFIG.id + '/position');

                onValue(posRef, (snapshot) => {
                    // const data = snapshot.val();
                    const updateMyCharacterData = {
                    ...mycharacterData, 
                    position: snapshot.val()
                };
                const updatedUsersList = {
                    ...allCharactersData
                };
                updatedUsersList[MY_CHARACTER_INIT_CONFIG.id] = updateMyCharacterData;
                updateAllCharactersData(updatedUsersList);
                  });

                
                set(posRef, newPos);
        
            }
            
        }
    }, [mycharacterData]);

    const tick = useCallback(() => {
        if (context != null) {
            setContext({canvas: context.canvas, frameCount: (context.frameCount + 1) % 60});
        }
        loopRef.current = requestAnimationFrame(tick);
    }, [context]);

    useEffect(() => {   
        loopRef.current = requestAnimationFrame(tick);
        return () => {
            loopRef.current && cancelAnimationFrame(loopRef.current);
        }
    }, [loopRef, tick])

    useEffect(() => {
        document.addEventListener('keypress', moveMyCharacter);
        return () => {
            document.removeEventListener('keypress', moveMyCharacter);
        }
    }, [moveMyCharacter]);

    return (
        <CanvasContext.Provider value={context}>
            <canvas
                ref={canvasRef} 
                width={TILE_SIZE * MAP_DIMENSIONS.COLS}
                height={TILE_SIZE * MAP_DIMENSIONS.ROWS}
                class="main-canvas"
            />
            {children}
        </CanvasContext.Provider>
    );
};

const mapStateToProps = (state) => {
    return {allCharactersData: state.allCharacters.users};
};

export default connect(mapStateToProps, {updateAllCharactersData})(GameLoop);
