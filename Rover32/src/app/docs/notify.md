
```jsx

 <div className="mb-6">
    {/* Info Alert (Blue) */}
    <div className="flex p-4 mb-4 border border-blue-500/30 bg-blue-500/10 rounded-xl backdrop-blur-sm">
        <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
            <h4 className="text-blue-400 font-medium">Note</h4>
            <p className="text-blue-300 text-sm">Make sure to download the correct firmware version for your ESP32 model.</p>
        </div>
    </div>

    {/* Warning Alert (Yellow) */}
    <div className="flex p-4 mb-4 border border-yellow-500/30 bg-yellow-500/10 rounded-xl backdrop-blur-sm">
        <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
            <h4 className="text-yellow-400 font-medium">Warning</h4>
            <p className="text-yellow-300 text-sm">Incorrect wiring may damage your ESP32 or other components.</p>
        </div>
    </div>

    {/* Error Alert (Red) */}
    <div className="flex p-4 mb-4 border border-red-500/30 bg-red-500/10 rounded-xl backdrop-blur-sm">
        <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
            <h4 className="text-red-400 font-medium">Important</h4>
            <p className="text-red-300 text-sm">Never connect the battery directly without the voltage regulator.</p>
        </div>
    </div>

    {/* Success Alert (Green) */}
    <div className="flex p-4 mb-4 border border-green-500/30 bg-green-500/10 rounded-xl backdrop-blur-sm">
        <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
            <h4 className="text-green-700 font-medium">Tip</h4>
            <p className="text-green-600 text-sm">For best performance, use high-quality 18650 batteries with at least 2500mAh capacity.</p>
        </div>
    </div>
</div>

```