import React, {useCallback, useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import CanvasContext from './CanvasContext';

import {MOVE_DIRECTIONS, MAP_DIMENSIONS, TILE_SIZE} from './mapConstants';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import {checkMapCollision} from './utils';

const GameLoop = ({children, allCharactersData}) => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    useEffect(() => {
        // frameCount used for re-rendering child components
        console.log("initial setContext");
        setContext({canvas: canvasRef.current.getContext('2d'), frameCount: 0});
    }, [setContext]);

    // keeps the reference to the main rendering loop
    const loopRef = useRef();
    let mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];

    const moveMyCharacter = useCallback((e) => {
        var currentPosition = mycharacterData.position;
        const key = e.key;
        if (MOVE_DIRECTIONS[key]) {
            // ***********************************************
            // TODO: Add your move logic here
            
            // console.log(key);
            // console.log(MOVE_DIRECTIONS[key]);
            // console.log(MOVE_DIRECTIONS[key][0]);

            console.log("Start: ", currentPosition);

            var xPos = currentPosition.x+MOVE_DIRECTIONS[key][0];
            var yPos = currentPosition.y+MOVE_DIRECTIONS[key][1];

            console.log(xPos);
            console.log(yPos);

            currentPosition = {x: xPos, y: yPos};

            console.log("End: ", currentPosition)

            mycharacterData.position = {x: xPos, y: yPos};

            //mycharacterData.position.useState();

            //console.log(mycharacterData.position);
            
            //mycharacterData.position = currentPosition;
            
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

export default connect(mapStateToProps, {})(GameLoop);
