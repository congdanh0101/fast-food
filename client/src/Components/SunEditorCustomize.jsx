import { useState } from 'react'
import { SunEditor } from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'

const defaultFonts = [
    'Arial',
    'Comic Sans MS',
    'Courier New',
    'Impact',
    'Georgia',
    'Tahoma',
    'Trebuchet MS',
    'Verdana',
]

const SunEditorCustomize = () => {
    const [value, setValue] = useState('')

    const sortedFontOptions = [
        'Logical',
        'Salesforce Sans',
        'Garamond',
        'Sans-Serif',
        'Serif',
        'Times New Roman',
        'Helvetica',
        ...defaultFonts,
    ].sort()

    return (
        <div>
            <SunEditor
                setContents={value}
                onChange={setValue}
                setOptions={{
                    buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize'],
                        // ['paragraphStyle', 'blockquote'],
                        [
                            'bold',
                            'underline',
                            'italic',
                            'strike',
                            'subscript',
                            'superscript',
                        ],
                        ['fontColor', 'hiliteColor'],
                        ['align', 'list', 'lineHeight'],
                        ['outdent', 'indent'],

                        ['table', 'horizontalRule', 'link', 'image', 'video'],
                        // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                        // ['imageGallery'], // You must add the "imageGalleryUrl".
                        // ["fullScreen", "showBlocks", "codeView"],
                        ['preview', 'print'],
                        ['removeFormat'],

                        // ['save', 'template'],
                        // '/', Line break
                    ],
                    defaultTag: 'div',
                    minHeight: '300px',
                    showPathLabel: false,
                    font: sortedFontOptions,
                }}
            />
        </div>
    )
}

export default SunEditorCustomize
