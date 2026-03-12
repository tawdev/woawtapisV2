<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Models\Category;
use App\Models\Type;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Builder;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informations générales')
                    ->schema([
                        TextInput::make('name')
                            ->label('Nom du produit')
                            ->required()
                            ->columnSpan(2),
                        TextInput::make('slug')
                            ->label('Slug (URL)')
                            ->required()
                            ->columnSpan(2),
                        Textarea::make('description')
                            ->label('Description complète')
                            ->default(null)
                            ->rows(4)
                            ->columnSpanFull(),
                        Textarea::make('short_description')
                            ->label('Description courte')
                            ->default(null)
                            ->rows(2)
                            ->columnSpanFull(),
                    ])->columns(2),

                Section::make('Prix et stock')
                    ->schema([
                        TextInput::make('price')
                            ->label('Prix (MAD)')
                            ->required()
                            ->numeric()
                            ->prefix('MAD'),
                        TextInput::make('sale_price')
                            ->label('Prix soldé (MAD)')
                            ->numeric()
                            ->default(null)
                            ->prefix('MAD'),
                        TextInput::make('stock')
                            ->label('Stock')
                            ->required()
                            ->numeric()
                            ->default(0),
                        Select::make('status')
                            ->label('Statut')
                            ->options(['active' => 'Actif', 'inactive' => 'Inactif'])
                            ->default('active')
                            ->required(),
                    ])->columns(2),

                Section::make('Catégorie et type')
                    ->schema([
                        Select::make('type_id')
                            ->label('Type')
                            ->placeholder('Sélectionnez un type')
                            ->relationship('type', 'name')
                            ->default(null)
                            ->searchable()
                            ->preload()
                            ->live()
                            ->afterStateUpdated(fn(Set $set) => $set('category_id', null)),
                        Select::make('category_id')
                            ->label('Catégorie')
                            ->placeholder('Sélectionnez une catégorie')
                            ->disabled(fn(Get $get) => !$get('type_id'))
                            ->relationship(
                                'category',
                                'name',
                                fn(Builder $query, Get $get) => $query->when(
                                    $get('type_id'),
                                    fn($q, $typeId) => $q->where('type_id', $typeId)
                                )
                            )
                            ->required()
                            ->searchable()
                            ->preload(),
                    ])->columns(2),

                Section::make('Caractéristiques')
                    ->schema([
                        TextInput::make('material')
                            ->label('Matière')
                            ->default(null),
                        TextInput::make('size')
                            ->label('Dimensions')
                            ->default(null),
                        Select::make('color')
                            ->label('Couleur(s)')
                            ->placeholder('Choisir les couleurs')
                            ->options([
                                'Beige' => '<span class="flex items-center gap-2"><span class="w-4 h-4 rounded-full border border-stone-200" style="background-color: #F5F5DC"></span> Beige</span>',
                                'Blanc' => '<span class="flex items-center gap-2"><span class="w-4 h-4 rounded-full border border-stone-200" style="background-color: #FFFFFF"></span> Blanc</span>',
                                'Bleu' => '<span class="flex items-center gap-2"><span class="w-4 h-4 rounded-full border border-stone-200" style="background-color: #3B82F6"></span> Bleu</span>',
                                'Vert' => '<span class="flex items-center gap-2"><span class="w-4 h-4 rounded-full border border-stone-200" style="background-color: #10B981"></span> Vert</span>',
                                'Gris' => '<span class="flex items-center gap-2"><span class="w-4 h-4 rounded-full border border-stone-200" style="background-color: #6B7280"></span> Gris</span>',
                                'Jaune' => '<span class="flex items-center gap-2"><span class="w-4 h-4 rounded-full border border-stone-200" style="background-color: #FBBF24"></span> Jaune</span>',
                                'Marron' => '<span class="flex items-center gap-2"><span class="w-4 h-4 rounded-full border border-stone-200" style="background-color: #78350F"></span> Marron</span>',
                                'Noir' => '<span class="flex items-center gap-2"><span class="w-4 h-4 rounded-full border border-stone-200" style="background-color: #000000"></span> Noir</span>',
                                'Orange' => '<span class="flex items-center gap-2"><span class="w-4 h-4 rounded-full border border-stone-200" style="background-color: #F97316"></span> Orange</span>',
                                'Rose' => '<span class="flex items-center gap-2"><span class="w-4 h-4 rounded-full border border-stone-200" style="background-color: #EC4899"></span> Rose</span>',
                            ])
                            ->allowHtml()
                            ->multiple()
                            ->native(false)
                            ->searchable()
                            ->preload()
                            ->columnSpanFull(),
                    ])->columns(2),

                Section::make('Mise en avant')
                    ->schema([
                        Toggle::make('featured')
                            ->label('Produit vedette')
                            ->required(),
                        Toggle::make('best_seller')
                            ->label('Best-seller')
                            ->required(),
                    ])->columns(2),
            ]);
    }
}
