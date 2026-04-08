from rest_framework import serializers
from .models import Item, Proposal
class ProposalSerializer(serializers.ModelSerializer):
    freelancer_name = serializers.ReadOnlyField(source='freelancer.username')
    class Meta:
        model = Proposal
        fields = ('id','freelancer','freelancer_name','price','message','status','created_at')
        read_only_fields = ('id','freelancer','freelancer_name','created_at')
class ItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    proposals_count = serializers.SerializerMethodField()
    def get_proposals_count(self, obj): return obj.proposals.count()
    class Meta:
        model = Item
        fields = ('id','owner','owner_username','title','description','category','status','budget_type','budget','deadline','skills','proposals_count','created_at','updated_at')
        read_only_fields = ('id','owner','owner_username','created_at','updated_at')
class ItemDetailSerializer(ItemSerializer):
    proposals = ProposalSerializer(many=True, read_only=True)
    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ('proposals',)
