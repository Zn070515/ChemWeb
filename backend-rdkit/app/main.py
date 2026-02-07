from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rdkit import Chem
from rdkit.Chem import AllChem

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Generate3dRequest(BaseModel):
    input: str
    format: str | None = "smiles"


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/3d")
def generate_3d(request: Generate3dRequest) -> dict:
    input_text = request.input.strip() if request.input else ""
    if not input_text:
        raise HTTPException(status_code=400, detail="Input is required")

    fmt = (request.format or "smiles").strip().lower()

    try:
        if fmt in {"mol", "sdf"}:
            mol = Chem.MolFromMolBlock(input_text, sanitize=True, removeHs=False)
        else:
            mol = Chem.MolFromSmiles(input_text)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to parse input: {exc}")

    if mol is None:
        raise HTTPException(status_code=400, detail="Failed to parse input")

    mol = Chem.AddHs(mol)
    params = AllChem.ETKDGv3()
    params.randomSeed = 17

    try:
        status = AllChem.EmbedMolecule(mol, params)
        if status != 0:
            raise ValueError("Embedding failed")
        if AllChem.MMFFHasAllMoleculeParams(mol):
            AllChem.MMFFOptimizeMolecule(mol)
        else:
            AllChem.UFFOptimizeMolecule(mol)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"3D generation failed: {exc}")

    conf = mol.GetConformer()
    atoms = []
    for idx, atom in enumerate(mol.GetAtoms()):
        pos = conf.GetAtomPosition(idx)
        atoms.append({
            "index": idx,
            "element": atom.GetSymbol(),
            "x": float(pos.x),
            "y": float(pos.y),
            "z": float(pos.z),
        })

    bonds = []
    for bond in mol.GetBonds():
        order = bond.GetBondTypeAsDouble()
        bonds.append({
            "from": bond.GetBeginAtomIdx(),
            "to": bond.GetEndAtomIdx(),
            "order": int(round(order)),
        })

    sdf = Chem.MolToMolBlock(mol)

    return {"atoms": atoms, "bonds": bonds, "sdf": sdf}
