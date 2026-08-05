import React from 'react';
import styled from 'styled-components';

const Radio = ({ label1 = 'Man', label2 = 'Woman' }) => {
    return (
        <StyledWrapper>
            <div className="mydict">
                <div>
                    <label>
                        <input type="radio" name="radio" defaultChecked />
                        <span>{label1}</span>
                    </label>
                    <label>
                        <input type="radio" name="radio" />
                        <span>{label2}</span>
                    </label>
                </div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    :focus {
        outline: 0;
        border-color: #2260ff;
        box-shadow: 0 0 0 4px #b5c9fc;
    }

    .mydict div {
        display: flex;
        flex-wrap: wrap;
        margin-top: 0.5rem;
        justify-content: center;
    }

    .mydict input[type='radio'] {
        clip: rect(0 0 0 0);
        clip-path: inset(100%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
    }

    .mydict input[type='radio']:checked + span {
        box-shadow: 0 0 0 0.0625em #0043ed;
        background-color: #dee7ff;
        z-index: 1;
        color: #0043ed;
    }

    label span {
        display: block;
        cursor: pointer;
        background-color: #fff;
        padding: 0.375em 0.75em;
        position: relative;
        margin-left: 0.0625em;
        box-shadow: 0 0 0 0.0625em #b5bfd9;
        letter-spacing: 0.05em;
        color: #3e4963;
        text-align: center;
        transition: background-color 0.5s ease;
    }

    label:first-child span {
        border-radius: 0.375em 0 0 0.375em;
    }

    label:last-child span {
        border-radius: 0 0.375em 0.375em 0;
    }
`;

export default Radio;
