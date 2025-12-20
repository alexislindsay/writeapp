/**
 * LexOS Core Implementation
 * Universal Information Architecture
 * Part of the Progenitor Protocol
 *
 * "LexOS is not universal by conversion. LexOS is universal by being."
 */

class LexOS {
    constructor() {
        this.version = "1.0.0-alpha";
        this.quantumField = new Map();
        this.entanglements = new Map();
    }

    /**
     * Create a LexOS seed from content
     * Compresses content to 1KB metadata seed
     *
     * @param {any} content - The content to convert to seed
     * @param {Object} options - Metadata and relationship options
     * @returns {Object} - The LexOS seed (ideally ~1KB)
     */
    createSeed(content, options = {}) {
        const seed = {
            lex_id: this.generateQuantumID(),
            version: this.version,
            timestamp: Date.now(),
            hash: this.contentHash(content),

            // Core essence (to be compressed)
            essence: this.extractEssence(content, options),

            // Dimensional metadata
            dimensions: this.calculateDimensions(content),

            // Relationship mapping
            entanglements: options.relationships || [],

            // Manifestation hints
            manifestation_protocol: options.protocol || "auto",

            // Willful breath doctrine
            breath: {
                intention: options.intention || "universal",
                context: options.context || {},
                observer: options.observer || "anonymous"
            }
        };

        // Store in quantum field
        this.quantumField.set(seed.lex_id, seed);

        // Register entanglements
        if (seed.entanglements.length > 0) {
            this.registerEntanglements(seed.lex_id, seed.entanglements);
        }

        return seed;
    }

    /**
     * Manifest a LexOS seed into a specific format
     *
     * @param {Object} seed - The LexOS seed
     * @param {string} targetFormat - Desired format (pdf, json, html, etc)
     * @param {Object} intention - User intention/context
     * @returns {any} - The manifested content
     */
    manifest(seed, targetFormat, intention = {}) {
        // Verify seed
        if (!this.verifySeed(seed)) {
            throw new Error("Invalid or corrupted LexOS seed");
        }

        // Get manifestation function for target format
        const manifestor = this.getManifestor(targetFormat);

        // Apply willful breath doctrine
        const context = {
            ...seed.breath.context,
            ...intention,
            targetFormat,
            timestamp: Date.now()
        };

        // Manifest (collapse quantum state)
        const manifested = manifestor(seed, context);

        // Verify coherence
        if (!this.verifyCoherence(seed, manifested)) {
            console.warn("Manifestation coherence warning - hash mismatch possible");
        }

        return manifested;
    }

    /**
     * Generate quantum ID for LexOS seed
     */
    generateQuantumID() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 15);
        const entropy = Math.random().toString(36).substring(2, 15);
        return `lex_${timestamp}_${random}_${entropy}`;
    }

    /**
     * Hash content for verification
     */
    contentHash(content) {
        // Simple hash for demo - replace with proper crypto hash
        const str = JSON.stringify(content);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(36);
    }

    /**
     * Extract essence from content
     * This is where the magic happens - compress to core pattern
     */
    extractEssence(content, options) {
        // TODO: Implement sophisticated compression
        // For now, basic structure preservation
        if (typeof content === 'string') {
            return {
                type: 'text',
                length: content.length,
                sample: content.substring(0, 100),
                structure: this.analyzeStructure(content)
            };
        } else if (typeof content === 'object') {
            return {
                type: 'structured',
                keys: Object.keys(content),
                depth: this.calculateDepth(content),
                sample: JSON.stringify(content).substring(0, 100)
            };
        } else {
            return {
                type: typeof content,
                value: content
            };
        }
    }

    /**
     * Calculate content dimensions
     */
    calculateDimensions(content) {
        return {
            bytes: new Blob([JSON.stringify(content)]).size,
            complexity: this.calculateComplexity(content),
            entropy: this.calculateEntropy(content)
        };
    }

    /**
     * Analyze structure of content
     */
    analyzeStructure(content) {
        if (typeof content !== 'string') return null;

        return {
            lines: content.split('\n').length,
            words: content.split(/\s+/).length,
            characters: content.length,
            hasMarkdown: /^#{1,6}\s/.test(content),
            hasHTML: /<[^>]+>/.test(content),
            hasCode: /```/.test(content)
        };
    }

    /**
     * Calculate depth of nested structure
     */
    calculateDepth(obj, current = 0) {
        if (typeof obj !== 'object' || obj === null) return current;

        let maxDepth = current;
        for (const key in obj) {
            const depth = this.calculateDepth(obj[key], current + 1);
            maxDepth = Math.max(maxDepth, depth);
        }
        return maxDepth;
    }

    /**
     * Calculate complexity score
     */
    calculateComplexity(content) {
        const str = JSON.stringify(content);
        const uniqueChars = new Set(str).size;
        return uniqueChars / str.length;
    }

    /**
     * Calculate Shannon entropy
     */
    calculateEntropy(content) {
        const str = JSON.stringify(content);
        const freq = {};

        for (const char of str) {
            freq[char] = (freq[char] || 0) + 1;
        }

        let entropy = 0;
        const len = str.length;

        for (const char in freq) {
            const p = freq[char] / len;
            entropy -= p * Math.log2(p);
        }

        return entropy;
    }

    /**
     * Register entanglements between seeds
     */
    registerEntanglements(seedId, relatedIds) {
        if (!this.entanglements.has(seedId)) {
            this.entanglements.set(seedId, new Set());
        }

        const relationships = this.entanglements.get(seedId);
        relatedIds.forEach(id => relationships.add(id));
    }

    /**
     * Get manifestation function for target format
     */
    getManifestor(format) {
        const manifestors = {
            json: (seed, ctx) => this.manifestAsJSON(seed, ctx),
            text: (seed, ctx) => this.manifestAsText(seed, ctx),
            html: (seed, ctx) => this.manifestAsHTML(seed, ctx),
            markdown: (seed, ctx) => this.manifestAsMarkdown(seed, ctx)
        };

        return manifestors[format.toLowerCase()] || manifestors.json;
    }

    /**
     * Manifest as JSON
     */
    manifestAsJSON(seed, context) {
        return {
            meta: {
                lex_id: seed.lex_id,
                manifested_at: context.timestamp,
                manifested_as: "json",
                intention: context.intention
            },
            data: seed.essence,
            dimensions: seed.dimensions,
            entanglements: Array.from(seed.entanglements || [])
        };
    }

    /**
     * Manifest as plain text
     */
    manifestAsText(seed, context) {
        let text = `LexOS Document\n`;
        text += `ID: ${seed.lex_id}\n`;
        text += `Manifested: ${new Date(context.timestamp).toISOString()}\n`;
        text += `\n`;
        text += `Content:\n`;
        text += JSON.stringify(seed.essence, null, 2);
        return text;
    }

    /**
     * Manifest as HTML
     */
    manifestAsHTML(seed, context) {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>LexOS Document ${seed.lex_id}</title>
    <meta name="lex-id" content="${seed.lex_id}">
    <meta name="manifested" content="${context.timestamp}">
    <style>
        body { font-family: monospace; background: #0a0a0a; color: #00ff88; padding: 20px; }
        .essence { background: rgba(0,255,136,0.1); padding: 20px; border-radius: 10px; }
    </style>
</head>
<body>
    <h1>LexOS Document</h1>
    <p>ID: ${seed.lex_id}</p>
    <p>Manifested: ${new Date(context.timestamp).toISOString()}</p>
    <div class="essence">
        <h2>Content</h2>
        <pre>${JSON.stringify(seed.essence, null, 2)}</pre>
    </div>
</body>
</html>
        `;
    }

    /**
     * Manifest as Markdown
     */
    manifestAsMarkdown(seed, context) {
        let md = `# LexOS Document\n\n`;
        md += `**ID**: \`${seed.lex_id}\`\n`;
        md += `**Manifested**: ${new Date(context.timestamp).toISOString()}\n\n`;
        md += `## Content\n\n`;
        md += `\`\`\`json\n${JSON.stringify(seed.essence, null, 2)}\n\`\`\`\n`;
        return md;
    }

    /**
     * Verify seed integrity
     */
    verifySeed(seed) {
        return seed &&
               seed.lex_id &&
               seed.hash &&
               seed.essence &&
               seed.dimensions;
    }

    /**
     * Verify manifestation coherence
     */
    verifyCoherence(seed, manifested) {
        // TODO: Implement proper coherence verification
        // For now, just check that manifestation exists
        return manifested !== null && manifested !== undefined;
    }

    /**
     * Get all entangled seeds
     */
    getEntangledSeeds(seedId) {
        const related = this.entanglements.get(seedId);
        if (!related) return [];

        return Array.from(related).map(id => this.quantumField.get(id));
    }

    /**
     * Export seed to 1KB format (ideally)
     */
    exportSeed(seed) {
        // Create minimal representation
        const minimal = {
            i: seed.lex_id,
            h: seed.hash,
            e: seed.essence,
            d: seed.dimensions,
            t: seed.timestamp
        };

        const json = JSON.stringify(minimal);
        const bytes = new Blob([json]).size;

        console.log(`Seed export size: ${bytes} bytes (target: ~1024 bytes)`);

        return minimal;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LexOS;
}

// Demo usage
if (typeof window !== 'undefined') {
    window.LexOS = LexOS;

    // Console demo
    console.log('%cLexOS Core Loaded', 'font-size: 16px; color: #00ff88; font-weight: bold;');
    console.log('%c"LexOS is not universal by conversion. LexOS is universal by being."', 'font-size: 12px; color: #888; font-style: italic;');
}
