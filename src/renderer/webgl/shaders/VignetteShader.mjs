/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import DefaultShader from "./DefaultShader.mjs";

export default class VignetteShader extends DefaultShader {
    constructor(context) {
        super(context);
        this._magnitude = 1.3;
        this._intensity = 0.7;
        this._pivotX = 0.5;
        this._pivotY = 0.5;
    }

    setupUniforms(operation) {
        super.setupUniforms(operation);

        this._setUniform("magnitude", this._magnitude , this.gl.uniform1f);
        this._setUniform("intensity", this._intensity, this.gl.uniform1f);
        this._setUniform("pivotX", this._pivotX, this.gl.uniform1f);
        this._setUniform("pivotY", this._pivotY, this.gl.uniform1f);
        this.redraw()
    }
    get pivotX() {
        return this._pivotX;
    }

    set pivotX(v) {
        this._pivotX = v;
        this.redraw();
    }

    get pivotY() {
        return this._pivotY;
    }

    set pivotY(v) {
        this._pivotY = v;
        this.redraw();
    }

    get intensity() {
        return this._intensity;
    }

    set intensity(v) {
        this._intensity = v;
        this.redraw();
    }

    get magnitude() {
        return this._magnitude;

    }

    set magnitude(v) {
        this._magnitude = v;
        this.redraw();
    }
}

VignetteShader.vertexShaderSource = DefaultShader.vertexShaderSource;

VignetteShader.fragmentShaderSource = `

    #ifdef GL_ES
    precision lowp float;
    #endif
    varying vec2 vTextureCoord;
    varying vec4 vColor;
    uniform sampler2D uSampler;

    uniform float magnitude;
    uniform float intensity;
    uniform float pivotX;
    uniform float pivotY;

    void main() {
        vec2 pivot = vec2(pivotX, pivotY);
        vec2 uv = vTextureCoord.xy - pivot + vec2(0.5);
        uv.x = clamp(uv.x, 0.0, 1.0);
        uv.y = clamp(uv.y, 0.0, 1.0);
   
        uv *=  1.00 - uv.yx;
        float vig = uv.x * uv.y * 25.0 * intensity;
        vig = pow(vig, 0.45 * magnitude);
        vec4 fragColor = vec4(vig) * vColor;
        gl_FragColor = texture2D(uSampler, vTextureCoord) * fragColor;

    }
`