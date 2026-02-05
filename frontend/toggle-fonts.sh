#!/bin/bash

# Toggle Google Fonts fetching for development
# Usage: ./toggle-fonts.sh [on|off]

if [ "$1" = "off" ]; then
    echo "DISABLE_GOOGLE_FONTS=true" > .env.local
    echo "✅ Google Fonts disabled for development"
    echo "Your app will now use system font fallbacks instead"
elif [ "$1" = "on" ]; then
    if [ -f ".env.local" ]; then
        # Remove the DISABLE_GOOGLE_FONTS line if it exists
        grep -v "DISABLE_GOOGLE_FONTS" .env.local > .env.local.tmp && mv .env.local.tmp .env.local
        # Remove .env.local if it's empty
        if [ ! -s ".env.local" ]; then
            rm .env.local
        fi
    fi
    echo "✅ Google Fonts enabled for development"
    echo "Your app will now fetch fonts from Google Fonts"
else
    echo "Usage: ./toggle-fonts.sh [on|off]"
    echo "  on  - Enable Google Fonts fetching"
    echo "  off - Disable Google Fonts fetching (use for school network)"
fi
